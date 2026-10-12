# Stage 1: Build JAR with Maven and Java 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Setup non-privileged user and ensure write permissions for embedded database
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

# Copy executable jar from builder
COPY --from=builder --chown=appuser:appgroup /workspace/target/*.jar app.jar

USER appuser

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=standalone
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-standalone} -jar app.jar"]
