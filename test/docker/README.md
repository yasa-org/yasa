Go to the root dir of the repo.

- Test Basic authorization

```shell
docker-compose -f test/docker/docker-compose.basic.yaml up -d
```

then open http://localhost:8983/v2/yasa

- Test JWT authorization

```shell
echo "127.0.0.1    keycloak" | sudo tee -a /etc/hosts
docker-compose -f test/docker/docker-compose.jwt.yaml up -d
```

then open http://localhost:8983/v2/yasa
