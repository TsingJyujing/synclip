package com.github.tsingjyujing.synclip

import org.assertj.core.api.Assertions.assertThat
import com.github.tsingjyujing.synclip.controller.ClipboardRestApi
import com.github.tsingjyujing.synclip.controller.Health
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SynclipApplicationTests {


	@Autowired
	private val clipboardRestApiController: ClipboardRestApi? = null
	@Autowired
	private val healthController: Health? = null

	@Test
	fun contextLoads() {
		assertThat(clipboardRestApiController).isNotNull
		assertThat(healthController).isNotNull
	}



}
