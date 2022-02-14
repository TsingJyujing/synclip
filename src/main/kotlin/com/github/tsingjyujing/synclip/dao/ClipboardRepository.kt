package com.github.tsingjyujing.synclip.dao

import com.github.tsingjyujing.synclip.entity.Clipboard
import org.springframework.data.repository.CrudRepository

interface ClipboardRepository : CrudRepository<Clipboard, String>