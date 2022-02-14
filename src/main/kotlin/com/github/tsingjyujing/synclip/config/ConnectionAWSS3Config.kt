package com.github.tsingjyujing.synclip.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class ConnectionAWSS3Config {

    @Value("\${s3.access-key}")
    private var awsId: String? = null

    @Value("\${s3.secret-key}")
    private var awsKey: String? = null

    @Value("\${s3.endpoint}")
    private var endpoint: String? = null

    @Bean
    fun basicAWSCredentials(): BasicAWSCredentials? {
        return BasicAWSCredentials(awsId, awsKey)
    }

    @Bean
    fun amazonS3(): AmazonS3? {
        return AmazonS3ClientBuilder.standard(
        ).withEndpointConfiguration(
            AwsClientBuilder.EndpointConfiguration(endpoint, Regions.DEFAULT_REGION.getName())
        ).withCredentials(
            AWSStaticCredentialsProvider(basicAWSCredentials())
        ).withPathStyleAccessEnabled(
            true
        ).build()
    }
}