# Resilient Microservices

How can we make our microservice more resilient?

![](assets/res_micro.png)

Authors: Sebastian Opacki, Rafał Łukowski
Date: unpublished
Category: backend

tags: microservices,resillency,timeout,circuit breaker,retry

---

### **Introduction**
Nowadays, most big modern systems are designed based on microservices architecture. However, in some situations, such as a small application, a monolith architecture is not a bad idea,
but then a single error can collapse the entire system. This risk can be reduced by using a microservices architecture, which helps to reduce coupling and allows services to operate independently. As a result, a single error cannot break the entire system.
Using a microservices architecture also allows us to manage specific areas without affecting the whole application.
Does that mean a microservices architecture has no flaws? No, there is nothing for free, we get certain benefits, but we also need to deal with other problems such as failures in microservices.
Microservices applications rely heavily on distributed systems, ensuring resilience becomes a critical aspect of their design and performance.

### **Understanding Microservices Resilience and Resiliency pattern**
Resilience in microservices refers to a system's ability to anticipate and handle dependency failures, such as failures in other system microservices or third-party systems.
In a world where plenty of services talk to each other we need to be prepared for failures that can be caused by various reasons such as service failures, network failures, and so on.
Resiliency patterns in microservices are established mechanisms that enable applications to manage failures, ensuring stability even in complex, distributed systems.
Implementing those patterns can assist developers in minimizing the impact of unexpected errors or excessive load on the system, which in turn can reduce downtimes and improve the overall performance of the application.

### **Common Resiliency Patterns**
It's important to note that achieving resiliency in microservices can be done by implementing the patterns described below at both the application/service level and the infrastructure level, such as in Istio. 
If there are plenty of microservices and the same configuration is required for all of them, it's better to use an infrastructure solution rather than implementing patterns for each service. 
However, if the patterns need to be implemented only in certain scenarios and not across all services, it's better to choose the service resiliency level method.

## Timeout

Microservices talk to each other, not only to internal API's in the same container or machine, but also to other external dependencies.
When we use synchronous call then we need to be prepared for a scenario when a dependency is not a reachable.
We should always have explicitly declared value of timeout in our configuration. For instance, if we use for synchronous call RestTemplate and Spring then we can configure:

```bash  
  @Bean
  public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
    return restTemplateBuilder
      .setConnectTimeout(Duration.ofSeconds(2000))
      .setReadTimeout(Duration.ofSeconds(2000))
      .build();
  }
```

- ConnectTimeout is the timeout for creating a connection. For instance, you are dealing with unreliable server, you want to wait only few seconds before notifying a end user that "something is wrong".

- ReadTimeout is the timeout when you have a connection, you're blocked on read() and you want to get an exception if the read blocks for more than timeout.
It does not matter if you are using a Java application, the Spring Framework, or a RestTemplate client - it is important to always set a timeout in your application when making synchronous calls to other dependencies.

By having declared timeout we can deal with issues when dependency is unreliable, sometime we just a cut a connection and just a log an error, but in other cases we need to quickly notify end user about the error.

## Learn more:
## https://resilience4j.readme.io/docs/timeout
## https://www.baeldung.com/spring-rest-timeout

### **Circuit Breaker Pattern**
Circuit Breaker Pattern is a crucial mechanism used in a microservices architecture to prevent cascading failures across services.
It detects when a dependency that we are trying to reach is unstable by checking a ratio of success and failed calls to that dependency
The circuit breaker pattern works in three states: closed, open and half-open:

- Closed State
This is the normal operational state when there are no errors encountered during invocation to dependency. In this state, all requests from the client are passed through to the downstream service.

- Open State
When there are too many failed responses from an external dependency, the mechanism changes the state to 'Open'. In this state, requests do not reach the service, and instead, a callback method is called or an error is thrown instantly. 
By doing this, we give time for the dependency to recover.

- Half-Open State
After a configured time, the Open State needs to be finished. We then check if our dependency has recovered or still is unhealthy.
In 'Open State' we allow some request to reach the external dependency and base on the ratio of responses we decide if the next state will be 'Open' or 'Closed'.
If the server is responding well, then we change the state to 'Closed', indicating that all is good. 
However, if the service is still encountering issues, we transition back to the 'Open' state. 
The 'Half-Open' state is a way to gradually test whether the dependency has recovered, before fully re-enabling traffic to the system.

## Example

In this example we use a resilience4j library:
pom.xml
```bash 
<dependency>
  <groupId>io.github.resilience4j</groupId>
  <artifactId>resilience4j-spring-boot2</artifactId>
  <version>1.7.0</version>
</dependency>
```

To simplify our code we can use an annotation instead of manually preparing a CircuitBreakerRegistry and CircuitBreakerConfig with code configuration.
Let's assume that we have a method which we would like to wrapp with our circuit breaker mechanism:
```bash 
@CircuitBreaker(name = "postRegisterCustomer")
public ResponseEntity<RegisterAppAccountResultDto> postRegisterAppFunction(RegisterAppAccountCommand registerAppAccountCommand) {
        var httpEntity = new HttpEntity<>(registerAppAccountCommand, getHeader());
        var url = "http://localhost:8080";****
        
        return restTemplate.postForEntity(url, httpEntity, RegisterAppAccountResultDto.class);
    }
}
```
## Configuration of circuit breaker logger:
```bash 
@Configuration
@Slf4j
public class CircuitBreakerLogger {

    @Bean
    public RegistryEventConsumer<CircuitBreaker> registryEventConsumer() {

        return new RegistryEventConsumer<>() {
            @Override
            public void onEntryAddedEvent(@NotNull EntryAddedEvent<CircuitBreaker> entryAddedEvent) {
                entryAddedEvent.getAddedEntry().getEventPublisher().onEvent(event -> log.info(event.toString()));
            }

            @Override
            public void onEntryRemovedEvent(@NotNull EntryRemovedEvent<CircuitBreaker> entryRemoveEvent) {
                //no needed logs
            }

            @Override
            public void onEntryReplacedEvent(@NotNull EntryReplacedEvent<CircuitBreaker> entryReplacedEvent) {
                //no needed logs
            }
        };
    }
}
```

## Applicaion live properties:
```bash 
"resilience4j.circuitbreaker.instances.postRegisterCustomer.ignoreExceptions": "org.springframework.web.client.HttpClientErrorException"
"resilience4j.circuitbreaker.instances.postRegisterCustomer.slowCallDurationThreshold": "5000"
"resilience4j.circuitbreaker.instances.postRegisterCustomer.wait-duration-in-open-state": "10000"```
```

## Learn more:
## https://resilience4j.readme.io/docs/circuitbreaker
## https://medium.com/bliblidotcom-techblog/resilience4j-circuit-breaker-implementation-on-spring-boot-9f8d195a49e0

### **Retry Pattern**

In a Microservices Architecture, you may encounter problems such as:
- Component Failure - during maintenance windows
- Component Overload - threshold limiting the number of requests to a component (throttling)
- Network Failure - Application not available for short stretches of time

All of the above problems occur for short periods and often do not require raising any errors. Instead, client in these scenarios should retry the request, such a retry is called implementing Retry Pattern. The whole idea of the pattern is about manipulating the duration to pause before retrying a failed request.

## Retry Backoff
By implementing Retry Backoff we are tackling a common computer science problem - Thundering Herd problem. If one of the service is down, and we have hundreds or thousands concurrent requests to it, each of which retries immediately, it is highly likely that we will end up with the service going down again. To resolve this issue, we have to implement Retry Backoff.
After each retry, the amount of time between requests should increase. It might look like this:
```
retry_counter*backoff
```
By doing so we are having a better chance of not overloading the service.

Another factor that we have to take into consideration is the scope of the operation. We do not want to end up in a situation where the system has not yet recovered from the previous call, and we are already retrying again. After adding this variable to our algorithm, it might look like this:
```
(retry_counter*backoff)+fixed_operation_time
```
Additionally, we can make it even more resilient by limiting the number of retries. All of this depends on the specific business case.

## Example

In this example we use a resilience4j library, just as other examples:
pom.xml
```bash 
<dependency>
  <groupId>io.github.resilience4j</groupId>
  <artifactId>resilience4j-spring-boot2</artifactId>
  <version>1.7.0</version>
</dependency>
```

Method with a call what we would like to monitor and retry if needed:
```bash
@Retry(name = "postConfirmation")
public void initiateConfirmation(@Valid ScaConfirmationDTO confirmation) {
    final ConfirmationPostResponse confirmationPostResponse = confirmationClient
        .postConfirmation(confirmationRequest(confirmation));
    sendPushNotification(confirmation);
}
```

## Application live properties:
```bash
resilience4j.retry.instances.postConfirmation.max-attempts: "3"
resilience4j.retry.instances.postConfirmation.wait-duration: "1s"
resilience4j.retry.instances.postConfirmation.ignoreExceptions: 'org.springframework.web.client.HttpClientErrorException'
resilience4j.retry.metrics.legacy.enabled: "true"
resilience4j.retry.metrics.enabled: "true"
```

## Learn more:
## https://resilience4j.readme.io/docs/retry

### **Summary**

In this article, we have discussed various microservices patterns designed to enhance scalability and resilience in Microservice Architecture. By understanding and applying these patterns, developers can build more robust, scalable and resilient services that can effectively handle the complexities of modern applications.
