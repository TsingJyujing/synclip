package com.github.tsingjyujing.synclip.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import lombok.Getter
import lombok.Setter
import org.hibernate.annotations.GenericGenerator
import java.util.*
import javax.persistence.*

@Entity
@Getter
@Setter
@Table(name = "clipitem")
open class ClipItem {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator",
    )
    @Column(name = "id", nullable = false)
    open var id: String? = null
        protected set

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "clipboard_id", nullable = false)
    open lateinit var clipboard: Clipboard

    open lateinit var preview: String

    open lateinit var created: Date

    @PrePersist
    protected open fun onCreate() {
        created = Date()
    }
}