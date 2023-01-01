package com.github.tsingjyujing.synclip.util

import com.github.tsingjyujing.synclip.dao.ClipItemRepository
import com.github.tsingjyujing.synclip.entity.ClipItem
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException


class ClipItemUtilities(private val repo: ClipItemRepository) {
    private val logger: Logger = LoggerFactory.getLogger(ClipItemUtilities::class.java)
    fun getAndVerifyClipItem(clipId: String, itemId: String): ClipItem {
        val clipItem: ClipItem = repo.findByIdOrNull(itemId).takeIf { i ->
            i != null
        } ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND, "Can't find clipboard item $itemId"
        )
        if (clipItem.clipboard.id != clipId) {
            logger.warn("Requesting item $itemId with wrong clipId $clipId")
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN, "The item $itemId is not owned by $clipId"
            )
        }
        return clipItem
    }
}