package com.github.tsingjyujing.synclip.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/health")
class Health {

    @GetMapping("/")
    fun health() = ResponseEntity<Void>(HttpStatus.OK)

}