# how to run


## App
```
$ cd isucon9-qualify/webapp/go
$ GO111MODULE=on go run api.go main.go
```

## Bench (Make sure to off ./bin/shipment and ./bin/payment)

```
$ cd isucon9-qualify
$ make
$ ./bin/benchmarker
```

## pprof
```
$ cd isucon9-qualify
$ pprof -http=localhost:8080 . http://localhost:6060/debug/pprof/profile
```

# MySQL Docker and SLOW Query

```
$ cd isucon9-qualify/conf.d
$ docker run -v $(pwd):/etc/mysql/conf.d  --name mysql -e MYSQL_ROOT_PASSWORD=mysql -d -p 3306:3306 mysql
```

```
$ cd isucon9-qualify/conf.d
$ docker run -v $(pwd):/etc/mysql/conf.d  --name mysql -e MYSQL_ROOT_PASSWORD=mysql -d -p 3306:3306 mysql
```

```
$ cd webapp/sql
$ cat 00_create_database.sql | mysql -h127.0.0.1 -uroot -pmysql
$ ./init.sh
```

```
$ cd isucon9-qualify/conf.d
$ docker exec -it mysql /bin/bash
```

```
$ cd isucon9-qualify/conf.d
$ docker cp mysql:/tmp/mysql-sqlo.sql mysql-slow.sql
$ mysqldumpslow -s t ./mysql-slow.sql > slow.log
```
