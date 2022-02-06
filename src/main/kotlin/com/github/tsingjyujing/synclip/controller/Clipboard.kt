package com.github.tsingjyujing.synclip.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/clipboard")
class Clipboard {
    // TODO add GET request for listing clipboards (admin only)

    // GET

    /**
     * List items in clipboard
     */
    @GetMapping("/{clipId}/items/")
    fun listClipboardItems(
        @RequestParam(value = "limit", defaultValue = "100") limit: Int,
        @RequestParam(value = "offset", defaultValue = "0") offset: Int,
        @PathVariable clipId: String
    ) {
        // TODO list all items (ID and short text) with limit and offset
    }

    @GetMapping("/{clipId}/items/{itemId}")
    fun getClipboardItem(
        @PathVariable clipId: String,
        @PathVariable itemId: String
    ) {
        // TODO list all items (ID and short text) with limit and offset
    }
    //POST (Create)
    /**
     * Create a new clipboard
     */
    @PostMapping("/")
    fun createNewClipboard() {
        //TODO Create new object id
        //TODO Save generated id to database(?)
        //TODO Return ID
    }


    /**
     * Create a new clipboard item
     */
    @PostMapping("/{clipId}/items/")
    fun createNewClipboardItem(
        @PathVariable clipId: String
        // TODO add more parameters here, type/data/expiration?
    ) {
        // TODO create new item
    }

    // DELETE

    @DeleteMapping("/{clipId}")
    fun deleteClipboard(
        @PathVariable clipId: String,
    ) {
        // TODO remove clipboard id in db
        // TODO remove all items in async task
        // return 2xx empty response
    }

    @DeleteMapping("/{clipId}/items/{itemId}")
    fun deleteClipboardItem(
        @PathVariable clipId: String,
        @PathVariable itemId: String
    ) {
        // TODO remove clipboard item in db
        // TODO remove data async task
        // return 2xx empty response
    }


}