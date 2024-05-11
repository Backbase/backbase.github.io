# Building Reliable and Scalable Applications: A Guide to 12-Factor Apps with Java and Spring Boot

Modern software demands robust, scalable apps. Enter 12-Factor Apps, your guide to building cloud-native champions.
![](assets/12-factor-app.png)

Authors: Amith Kumar Madhusoodhanan
Date: unpublished
Category: backend

tags: 12-factor app, Java, Spring Boot, Cloud-native applications, DevOps, CI/CD, Microservices architecture, Docker, Containerization, Maven, Gradle, Configuration management, Dependency management, Backing services, Externalized configuration, Concurrency management, Logging, Monitoring, Scalability, Resilience

---
## What are 12-Factor Apps?

The 12-Factor App methodology, originally introduced by Heroku, outlines a set of guidelines for building applications that are:

  - **Portable**: Easy to deploy across different environments.
  - **Scalable**: Can readily scale up or down based on demand.
  - **Maintainable**: Simple to understand and modify.
  - **Disposable**: Can be easily restarted or replaced without impacting functionality.

Let's explore how to implement these principles using Java and Spring Boot:

---

### 1. Codebase

Maintain a single codebase for your application, typically stored in a version control system like Git. This ensures consistent code across development, staging, and production environments. Start by initializing a Git repository for your project:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-app.git
git push -u origin main

```

### 2. Dependencies

Declare all dependencies explicitly in a manifest file like a Maven POM (pom.xml) or Gradle build script. This avoids conflicts and ensures consistency between environments.

```xml
<project>
  <groupId>com.example</groupId>
  <artifactId>my-spring-boot-app</artifactId>
  <version>1.0.0</version>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- Add other dependencies here -->
    </dependencies>
</project>
```

### 3. Configuration

Store configuration details (database connection strings, API keys) outside your codebase. Use environment variables to load configuration specific to each environment. Spring Boot allows for externalized configuration sources like property files and environment variables. Here's an example of configuring a database connection in `application.properties`:

```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
server.port=${PORT:8080}
```

### 4. Backing Services

Treat databases and other external services as attached resources. Configure them through environment variables or service discovery mechanisms. Spring Boot's auto-configuration makes integrating with backing services like databases straightforward. Below is a simple service class that retrieves the database URL from configuration:

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    public String getDbUrl() {
        return dbUrl;
    }
}
```
```Dockerfile
# Dockerfile (environment variables for database)
ENV SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
ENV DB_HOST=my-database-service
ENV DB_NAME=mydb
ENV DB_USER=dbuser
ENV DB_PASSWORD=password
```

### 5. Build, Release, Run

Separate the build, release, and run stages. Spring Boot provides a powerful mvn package or gradle build command for building your application. You can then package the application as a JAR file for deployment.

Automating build, release, and run processes is crucial for efficiency. CI/CD tools like Jenkins or GitLab CI can help with this. Below is an example Jenkinsfile for a pipeline:

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                // Build steps
            }
        }
        stage('Test') {
            steps {
                // Test steps
            }
        }
        stage('Deploy') {
            steps {
                // Deployment steps
            }
        }
    }
}
```
GitHub Actions provides an excellent platform for CI/CD. Below is an example workflow for building and deploying a Spring Boot application:

```yaml
name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up JDK
      uses: actions/setup-java@v2
      with:
        java-version: '11'

    - name: Build with Maven
      run: mvn -B package --file pom.xml

  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        azure-k8s: '<your-azure-kubernetes-service>'
        images: 'your-docker-image:latest'
        namespace: 'default'
        secrets: '<your-kubernetes-secrets>'
```

### 6. Processes

Treat applications as one or more stateless processes. Each request should be handled independently without relying on persistent state within the process. Spring Boot applications typically run as stateless services, making them horizontally scalable. Spring Boot applications are standalone Java processes. You can run them using the `java -jar` command:

```bash
java -jar your-application.jar
```

### 7. Port Binding
Bind applications to a port using environment variables. Spring Boot applications typically listen on a port defined in the application properties or environment variables.

Spring Boot allows configuring the port dynamically using environment variables. Below is an example configuration in `application.properties`:

```properties
# Server port
server.port=${PORT:8080}
```

### 8. Concurrency

Leverage process-based concurrency for scaling. Spring Boot applications can be easily deployed across multiple instances to handle increased traffic.

Java provides powerful concurrency utilities. Spring Boot supports asynchronous processing. Here's an example of an asynchronous task in a service:

```java
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @Async
    public void asyncTask() {
        // Async task implementation
    }
}
```

### 9. Disposability

Design applications to be fast to start and stop. Spring Boot applications typically have quick startup times, making them suitable for containerization.

Spring Boot applications can gracefully handle shutdown signals. You can perform cleanup tasks using `@PreDestroy` annotation:

```java
import javax.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Component
public class MyComponent {

    @PreDestroy
    public void cleanup() {
        // Cleanup tasks
    }
}
```

### 10. Dev/Prod Parity

Keep development, staging, and production environments as similar as possible. This reduces the risk of deployment issues. By using environment variables and externalized configuration, you can achieve parity between environments.

Maintaining parity between development and production environments is essential. Docker is commonly used for this purpose:

Here's a Dockerfile for containerizing your Spring Boot application:

```Dockerfile
FROM openjdk:11-jre-slim
COPY target/your-application.jar /app.jar
CMD ["java", "-jar", "/app.jar"]
```

And a Kubernetes deployment manifest for deploying your application:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-application
spec:
  replicas: 3
  selector:
    matchLabels:
      app: your-application
  template:
    metadata:
      labels:
        app: your-application
    spec:
      containers:
      - name: your-application
        image: your-docker-image:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: your-application
spec:
  selector:
    app: your-application
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```


### 11. Logs

Treat logs as event streams. Spring Boot integrates seamlessly with logging frameworks like Logback, allowing you to centralize log collection and analysis.

Logging is critical for monitoring and debugging. Spring Boot uses SLF4J and Logback by default. You can configure logging levels and appenders in `logback-spring.xml`:

```xml
<configuration>
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
    </root>
</configuration>
```

### 12. Admin Processes

Run administrative tasks as one-off processes. Spring Boot applications can be extended with custom admin commands for specific tasks.

Admin processes, such as database migrations or scheduled tasks, should be part of your application. Here's an example of a scheduled task in Spring Boot:

```java
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    @Scheduled(fixedRate = 10000)
    public void performDatabaseCleanup() {
        // Database cleanup task
    }
}
```

---

## Benefits of 12-Factor Apps:

  - Increased Developer Productivity: Consistent environments and clear separation of concerns make development and maintenance easier.
  - Improved Scalability: Stateless processes allow for easy scaling based on demand.
  - Enhanced Portability: Applications can be deployed across different platforms with minimal changes.
  - Simplified Maintainability: Clear separation of code, configuration, and dependencies simplifies application management.

## Code Examples

Here's a simple Spring Boot application demonstrating some 12-Factor principles:

- https://github.com/Backbase/golden-sample-services