package com.github.tsingjyujing.synclip.dao

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.S3ObjectSummary
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class S3Storage {

    private val logger: Logger = LoggerFactory.getLogger(S3Storage::class.java)

    @Autowired
    lateinit var amazonS3: AmazonS3


    fun ensureBucket(bucketName: String) {
        if (!amazonS3.doesBucketExistV2(bucketName)) {
            logger.info("Creating non-exists bucket $bucketName")
            amazonS3.createBucket(bucketName)
        }
    }

    fun putText(bucketName: String, objectName: String, data: String) {
        amazonS3.putObject(bucketName, objectName, data)
    }

    fun putBinary(bucketName: String, objectName: String, data: ByteArray) {
        val meta = ObjectMetadata()
        meta.contentLength = data.size.toLong()
        amazonS3.putObject(bucketName, objectName, data.inputStream(), meta)
    }

    fun removeFile(bucketName: String, objectName: String) {
        amazonS3.deleteObject(bucketName, objectName)
    }

    fun listDir(bucketName: String, objectPrefix: String) = sequence<S3ObjectSummary> {
        var l = amazonS3.listObjects(bucketName, objectPrefix)
        while (true) {
            l.objectSummaries.forEach { s3ObjectSummary -> yield(s3ObjectSummary) }
            if (l.isTruncated) {
                l = amazonS3.listNextBatchOfObjects(l)
            } else {
                break
            }
        }
    }

    fun removeDir(bucketName: String, objectPrefix: String) {
        listDir(bucketName, objectPrefix).forEach { s3ObjectSummary ->
            run {
                logger.info("Removing ${s3ObjectSummary.key}")
                amazonS3.deleteObject(
                    bucketName, s3ObjectSummary.key
                )
            }
        }
    }
}