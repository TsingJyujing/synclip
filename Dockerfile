FROM gradle:7-jdk11 AS BUILD_JAR
WORKDIR /app
COPY *.gradle.kts gradle.* /app/
COPY gradle/ /app/gradle/
ARG MAVEN_REPO
RUN gradle build -x test --parallel --continue --no-daemon || true
COPY . /app
RUN gradle build -x test --parallel --no-daemon

FROM openjdk:11-jre-slim
COPY --from=BUILD_JAR /app/build/libs/synclip-0.0.1.jar /app/synclip-0.0.1.jar
CMD ["java", "-jar", "/app/synclip-0.0.1.jar"]
