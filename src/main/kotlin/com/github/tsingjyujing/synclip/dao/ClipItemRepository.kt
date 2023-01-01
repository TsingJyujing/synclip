package com.github.tsingjyujing.synclip.dao

import com.github.tsingjyujing.synclip.entity.ClipItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional

interface ClipItemRepository : JpaRepository<ClipItem, String> {

    @Query(
        value = "select ci from ClipItem ci where ci.clipboard.id = ?1",
        countQuery = "select count(1) from ClipItem ci where ci.clipboard.id = ?1"
    )
    fun findAllByClipboardId(clipboardId: String, pageable: Pageable): Page<ClipItem>

    @Modifying(flushAutomatically = true)
    @Transactional
    @Query("delete from ClipItem c where c.clipboard.id = ?1")
    fun deleteAllItemsByClipboardId(clipboardId: String)


    @Query(value = "select ci from ClipItem ci where (now() - ci.created) > ?1")
    fun getExpiredItems(expireInterval: Double): List<ClipItem>


}