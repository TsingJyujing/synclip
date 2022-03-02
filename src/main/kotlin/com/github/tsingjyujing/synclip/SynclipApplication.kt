package com.github.tsingjyujing.synclip

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@SpringBootApplication
class SynclipApplication {
    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        val allowedOrigins = ArrayList<String>()
        val corsOrigin = System.getenv("CORS_ORIGIN")
        if (corsOrigin != null) {
            allowedOrigins.add(corsOrigin)
        } else {
            // Default config for debugging
            allowedOrigins.add("http://localhost:3000")
            allowedOrigins.add("http://127.0.0.1:3000")
        }
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedOrigins(*(allowedOrigins.toTypedArray()))
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("Authorization");
            }
        }
    }
}

fun main(args: Array<String>) {
    runApplication<SynclipApplication>(*args)
}
