import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.7.7"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm") version "1.6.10"
    kotlin("plugin.spring") version "1.6.10"
}

group = "com.github.tsingjyujing"
version = "0.0.1"
java.sourceCompatibility = JavaVersion.VERSION_11

val mavenRepo: String? = System.getenv("MAVEN_REPO")
repositories {
    if (mavenRepo == null) {
        System.out.println("Using central maven")
        mavenCentral()
    } else {
        System.out.println("Using maven repo: $mavenRepo")
        maven {
            url = uri(mavenRepo)
        }
    }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.projectlombok:lombok:1.18.22")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    implementation("org.springframework.data:spring-data-jpa")
    implementation(platform("com.amazonaws:aws-java-sdk-bom:1.12.376"))
    implementation("com.amazonaws:aws-java-sdk-s3")
    runtimeOnly("mysql:mysql-connector-java")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation("eu.maxschuster:dataurl:2.0.0")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
