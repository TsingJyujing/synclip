package com.github.tsingjyujing.synclip.util

import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

fun createThumbnailData(imageFileData: ByteArray): ByteArray {
    val img = ImageIO.read(imageFileData.inputStream())
    val thumb = BufferedImage(
        100, 100,
        BufferedImage.TYPE_INT_RGB
    )
    val g2d = thumb.graphics as Graphics2D
    g2d.drawImage(
        img, 0, 0, thumb.width - 1, thumb.height - 1, 0, 0,
        img.width - 1, img.height - 1, null
    )
    g2d.dispose()
    val outputStream = ByteArrayOutputStream()
    ImageIO.write(thumb, "PNG", outputStream)
    return outputStream.toByteArray()
}