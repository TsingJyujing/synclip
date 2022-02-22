package com.github.tsingjyujing.synclip.entity


import lombok.Getter
import lombok.Setter
import org.hibernate.annotations.GenericGenerator
import java.util.*
import javax.persistence.*


@Entity
@Getter
@Setter
@Table(name = "clipboard")
open class Clipboard {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator",
    )
    @Column(name = "id", nullable = false)
    open var id: String? = null
        protected set

    open var nickName: String = ""

    open lateinit var created: Date

    @PrePersist
    protected open fun onCreate() {
        created = Date()
    }
}