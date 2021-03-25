FROM openjdk:9 as build

COPY . /src

WORKDIR /src

RUN ./mvnw clean package && cp /src/yasa-solr-plugin/target/yasa-solr-plugin-*.jar /yasa.jar

FROM python:3

WORKDIR /repo

EXPOSE 8000

COPY --from=build /yasa.jar yasa.jar

COPY test/docker/privatekey.pem privatekey.pem
COPY test/docker/repository.json repository.json

RUN SIG="$(openssl dgst -sha1 -sign privatekey.pem yasa.jar | openssl enc -base64)" && \
    SIG=$(echo -n "$SIG" | sed -z 's/\n//g') && \
    sed -i "s#{sig}#$SIG#g" repository.json && \
    cat repository.json

COPY test/docker/publickey.der publickey.der

CMD python3 -m http.server
