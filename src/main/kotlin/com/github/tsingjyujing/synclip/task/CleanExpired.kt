package com.github.tsingjyujing.synclip.task

import com.github.tsingjyujing.synclip.dao.ClipItemRepository
import com.github.tsingjyujing.synclip.dao.S3Storage
import com.github.tsingjyujing.synclip.util.ClipItemUtilities
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class CleanExpired {
    private val logger: Logger = LoggerFactory.getLogger(CleanExpired::class.java)

    @Value("\${synclip.expire-interval-secs}")
    private var expireIntervalSecs: Double = 30 * 24 * 3600 * 1.0

    @Autowired
    private lateinit var s3Storage: S3Storage

    @Value("\${s3.bucket}")
    private lateinit var bucketName: String

    @Autowired
    private lateinit var clipItemRepository: ClipItemRepository

    @Scheduled(fixedRateString = "\${synclip.clean-interval-ms}")
    fun cleanExpiredClipboardItems() {
        if (expireIntervalSecs > 0) {
            logger.info("Clean up clipboard items at ${LocalDateTime.now()} w/ expire interval=$expireIntervalSecs seconds")
            clipItemRepository.getExpiredItems(expireIntervalSecs).forEach { clipItem ->
                val itemId = clipItem.id!!
                val clipId = clipItem.clipboard.id!!
                if (clipItem.clipboard.id != null && clipItem.id != null) {
                    try {
                        clipItemRepository.delete(
                            ClipItemUtilities(clipItemRepository).getAndVerifyClipItem(clipId, itemId)
                        )
                        s3Storage.removeDir(bucketName, "$clipId/$itemId")
                        logger.info("Item $itemId removed.")
                    } catch (ex: Exception) {
                        logger.error("Error while deleting item ${clipItem.id}", ex)
                    }
                } else {
                    logger.error("Error while processing clipItem ${clipItem.id}, null ID")
                }
            }
        } else {
            logger.debug("Skip cleanup since expireIntervalSecs<=0")
        }

    }

}