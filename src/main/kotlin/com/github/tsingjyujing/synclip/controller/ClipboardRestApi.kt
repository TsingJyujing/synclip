package com.github.tsingjyujing.synclip.controller

import com.github.tsingjyujing.synclip.dao.ClipItemRepository
import com.github.tsingjyujing.synclip.dao.ClipboardRepository
import com.github.tsingjyujing.synclip.dao.S3Storage
import com.github.tsingjyujing.synclip.entity.ClipItem
import com.github.tsingjyujing.synclip.entity.Clipboard
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import javax.annotation.PostConstruct


@RestController
@RequestMapping("api/clipboard")
class ClipboardRestApi {
    private val logger: Logger = LoggerFactory.getLogger(ClipboardRestApi::class.java)

    // TODO add GET request for listing clipboards (admin only)
    @Autowired
    private lateinit var clipboardRepository: ClipboardRepository

    @Autowired
    private lateinit var clipItemRepository: ClipItemRepository

    @Autowired
    private lateinit var s3Storage: S3Storage

    @Value("\${s3.bucket}")
    private lateinit var bucketName: String


    @PostConstruct
    fun initialize() {
        s3Storage.ensureBucket(bucketName)
    }

    /**
     * Create a new clipboard
     */
    @PostMapping("/")
    fun createNewClipboard(): Clipboard {
        val clipboard = Clipboard()
        clipboardRepository.save(clipboard)
        return clipboard
    }

    /**
     * Get details of new clipboard
     */
    @GetMapping("/{clipId}")
    fun getClipboardDetails(@PathVariable clipId: String): Clipboard =
        clipboardRepository.findByIdOrNull(clipId).takeIf { c ->
            c != null
        } ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND, "Can't find clipboard $clipId"
        )

    /**
     * Create a new clipboard
     */
    @PatchMapping("/{clipId}")
    fun modifyClipboard(
        @PathVariable clipId: String,
        @RequestParam(value = "nickName") nickName: String?,
    ): Clipboard {
        val clipboard = clipboardRepository.findByIdOrNull(clipId).takeIf { c ->
            c != null
        } ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND, "Can't find clipboard $clipId"
        )
        var needUpdate = false
        if (nickName!=null){
            clipboard.nickName = nickName
            needUpdate = true
        }
        if (needUpdate) {
            clipboardRepository.save(clipboard)
        }
        return clipboard
    }
    data class ClipboardItemsResponse(val content: List<ClipItem>, val totalPages: Int)

    /**
     * List items in clipboard
     */
    @GetMapping("/{clipId}/item/")
    fun listClipboardItems(
        @RequestParam(value = "size", defaultValue = "100") size: Int,
        @RequestParam(value = "page", defaultValue = "0") page: Int,
        @PathVariable clipId: String
    ): ClipboardItemsResponse {
        val result: Page<ClipItem> = clipItemRepository.findAllByClipboardId(
            clipId, PageRequest.of(page, size, Sort.by("created").descending())
        )
        return ClipboardItemsResponse(
            content = result.content,
            totalPages = result.totalPages,
        )
    }

    private fun getAndVerifyClipItem(clipId: String, itemId: String): ClipItem {
        val clipItem: ClipItem = clipItemRepository.findByIdOrNull(itemId).takeIf { i ->
            i != null
        } ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND, "Can't find clipboard item $itemId"
        )
        if (clipItem.clipboard.id != clipId) {
            logger.warn("Requesting item $itemId with wrong clipid $clipId")
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN, "The item $itemId is not owned by $clipId"
            )
        }
        return clipItem
    }

    /**
     * Get basic information of clipboard item
     */
    @GetMapping("/{clipId}/item/{itemId}")
    fun getClipboardItem(
        @PathVariable clipId: String, @PathVariable itemId: String
    ) = getAndVerifyClipItem(clipId, itemId)

    /**
     * Get full binary content from clipboard item
     */
    @GetMapping("/{clipId}/item/{itemId}/content")
    fun getClipboardItemContent(
        @PathVariable clipId: String, @PathVariable itemId: String
    ): ResponseEntity<InputStreamResource> {
        val streamRes = InputStreamResource(s3Storage.amazonS3.getObject(bucketName, "$clipId/$itemId").objectContent)
        val httpHeaders = HttpHeaders()
        httpHeaders.contentLength = s3Storage.amazonS3.getObjectMetadata(bucketName, "$clipId/$itemId").contentLength
        return ResponseEntity<InputStreamResource>(
            streamRes,
            httpHeaders,
            HttpStatus.OK
        )
    }

    /**
     * Create a new clipboard item
     */
    @PutMapping("/{clipId}/item/")
    fun createNewClipboardItem(
        @PathVariable clipId: String, @RequestParam(value = "content") content: String
    ): ClipItem {
        val clipItem = ClipItem()
        clipItem.clipboard = clipboardRepository.findByIdOrNull(clipId).takeIf { c ->
            c != null
        } ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND, "Can't find clipboard $clipId"
        )
        clipItem.preview = content.substring(0, content.length.coerceAtMost(20))
        val savedItem = clipItemRepository.save(clipItem)
        val savedItemId = savedItem.id.takeIf { x -> x != null } ?: throw ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create item in clipboard"
        )
        s3Storage.putText(bucketName, "$clipId/$savedItemId", content)
        return savedItem
    }

    // DELETE

    @DeleteMapping("/{clipId}")
    fun deleteClipboard(
        @PathVariable clipId: String,
    ): ResponseEntity<Void> {
        if (!clipboardRepository.existsById(clipId)) {
            throw ResponseStatusException(
                HttpStatus.NOT_FOUND, "Can't find clipboard $clipId"
            )
        }
        // TODO check user permission after implemented login
        clipItemRepository.deleteAllItemsByClipboardId(clipId)
        clipboardRepository.deleteById(clipId)
        s3Storage.removeDir(bucketName, "$clipId/")
        return ResponseEntity<Void>(HttpStatus.NO_CONTENT)
    }

    @DeleteMapping("/{clipId}/item/{itemId}")
    fun deleteClipboardItem(
        @PathVariable clipId: String, @PathVariable itemId: String
    ): ResponseEntity<Void> {
        clipItemRepository.delete(
            getAndVerifyClipItem(clipId, itemId)
        )
        s3Storage.removeFile(bucketName, "$clipId/$itemId")
        return ResponseEntity<Void>(HttpStatus.NO_CONTENT)
    }

}