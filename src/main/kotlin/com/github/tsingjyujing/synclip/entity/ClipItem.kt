package com.github.tsingjyujing.synclip.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import lombok.Getter
import lombok.Setter
import java.util.*
import javax.persistence.*

@Entity
@Getter
@Setter
@Table(name = "clipitem")
open class ClipItem {
    @Id
    @Column(name = "id", nullable = false)
    open var id: String? = null

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "clipboard_id", nullable = false)
    open lateinit var clipboard: Clipboard

    open lateinit var mimeType: String
    open lateinit var preview: String

    open lateinit var created: Date

    @PrePersist
    protected open fun onCreate() {
        created = Date()
    }
}