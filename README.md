# Synclip

## Introduction

Open source net synchronized clipboard, WIP, please feel free to take a trial at https://synclip.tsingjyujing.com/ , but we do not provide SLA, may also delete expired data (>3months) when we facing storage shortage.

- [x] [Backend](https://github.com/TsingJyujing/synclip)
- [x] [Frontend](https://github.com/TsingJyujing/synclip-frontend)
- [ ] Android App
- [ ] iOS App
- [ ] Windows App
- [ ] Linux App
- [ ] MacOS App


## Create your own clipboard service

You can start a simple synclip service with docker-compose:

```yaml
version: "3"
services:
  minio:
    image: minio/minio
    environment:
      MINIO_ROOT_USER: "xxxxx"
      MINIO_ROOT_PASSWORD: "xxxxx"
    volumes:
      - minio-data:/data
    command:
      - "server"
      - "/data"
      - "--console-address"
      - ":9001"
  mysql:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=mysql-root-pwd
      - MYSQL_DATABASE=synclip
      - MYSQL_USER=synclip
      - MYSQL_PASSWORD=xxxxx
    command:
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_520_ci
    volumes:
      - mysql-data:/var/lib/mysql
  app:
    image: tsingjyujing/synclip
    ports:
      - "8010:8080"
    environment:
      # do not set true in prod env
      SPRING_JPA_SHOW_SQL: "true"
      S3_ENDPOINT: "http://minio:9000"
      S3_ACCESS_KEY: "xxxxx"
      S3_SECRET_KEY: "xxxxx"
      SPRING_DATASOURCE_URL: "jdbc:mysql://mysql:3306/synclip"
      SPRING_DATASOURCE_PASSWORD: "xxxxx"
      CORS_ORIGIN: "https://synclip.tsingjyujing.com/"
    depends_on:
      - mysql
      - minio
  frontend:
    image: tsingjyujing/synclip-frontend
    ports:
      - "8011:80"
    depends_on:
      - app
volumes:
  mysql-data:
  minio-data:
```

1. The backend will be exposed to port 8010 and frontend will be exposed to 8011
2. Please set nginx/apache correctly, also modify the `CORS_ORIGIN` to handle the domain name.
3. You can replace the file backend to other S3 compatible storage
4. Also able to replace MySQL to other database.

