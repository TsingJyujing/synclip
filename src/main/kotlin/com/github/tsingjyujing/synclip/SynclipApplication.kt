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
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("Authorization");
            }
        }
    }
}

fun main(args: Array<String>) {
    runApplication<SynclipApplication>(*args)
}
