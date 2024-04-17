# Ways to improve BE API performance

Ways to improve BE API performance

![](assets/placeholder.png)

Authors: Yauheni Navosha
Date: unpublished
Category: backend

tags: backend, api, performance

---

# Introduction

Performance is crucial for modern apps. To achieve high performance of an app you need to utilize resources efficiently,
that in turn leads to cost saving in terms of infrastructure and operational expenses. Also, performance drastically
affects user experience - faster applications result in happier users, higher engagement. The article is an overview of
ways you could boost an API performance.

## Caching
### Use cases and advantages

![](assets/caching.png)

   To improve backend API performance using caching the general approach is to store in cache expensive or frequent queries to 3rd party APIs, time-consuming and complex database queries.
The approach has the following advantages:
  * Reduce response time for hundreds of milliseconds;
  * Retrieving data from a cache reduces network latency and overhead for accessing remote resources;
  * Caching can lead to cost saving by reducing the need for expensive infrastructure resources such as CPU, memory, and network.

  Also, developers should consider using local or distributed caches:
  * **Local cache** - refers to storing data on a single machine or within a single application. Good choice for scenarios where data retrieval is limited to one machine or where the volume of data is relatively small.
  * **Distributed cache** - involves storing data across multiple machines or nodes, often in a network. This type of caching is essential for applications that need to scale across multiple servers or are distributed geographically.

### Pitfalls
  * One of the most complex and challenging aspects of caching is deciding when and how to invalidate or update the cached data. Wrong **Caching invalidation** implementation might lead to losing advantages of caching or to providing outdated data to users.
  * Cache consistency - during temporary unavailability of a cache certain updates of data occurs in a source, but not in the cache. After the cache becomes available again the changes must be synchronized. Another separate complex topic is consistency of a distributed cache nodes.
  * Cache poisoning - caches are susceptible to various security threats, such as cache poisoning. Attackers inject malicious data into the cache compromising system integrity and user security, exposing harmful or fraudulent data to users.
