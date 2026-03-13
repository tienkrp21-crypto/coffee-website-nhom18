FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Cấp quyền thực thi cho file mvnw
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests
ENTRYPOINT ["java","-jar","target/coffee-0.0.1-SNAPSHOT.jar"]