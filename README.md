run: `docker-compose up`

- metrics at: http://localhost:3000/d/a4062646-c793-4656-bd92-c28f10679cea/metrics?orgId=1&tab=alert&from=now-5m&to=now

- prom metrics are located at: src/prometheus/prometheus.service.ts
- logic of the service is located at: src/query-attestations.service.ts

1. web app listen on http://localhost:8080 , prom metrics on: http://localhost:8080/metrics
2. prom listen on http://localhost:9090
3. grafana listen on http://localhost:3000

- I did everything requested + bonus.

That was fun!

![](https://i.imgur.com/RlxKnol.png)
