# isucon9-qualify

## ディレクトリ構成

```
├── bench        # ベンチマーカーなどが依存するパッケージのソースコード
├── cmd          # ベンチマーカーなどのソースコード
├── docs         # 運営が用意した各種ドキュメント
├── initial-data # 初期データ作成
├── provisioning # セットアップ用ansible
└── webapp       # 各言語の参考実装
```

## 前準備

```
# 初期データ作成
$ cd initial-data
$ make

# 初期画像データダウンロード

$ cd webapp/public
# GitHub releases から initial.zip をダウンロード
$ unzip initial.zip
$ rm -rf upload
$ mv v3_initial_data upload

# ベンチマーク用画像データダウンロード

$ cd initial-data
# GitHub releases から bench1.zip をダウンロード
$ unzip bench1.zip
$ rm -rf images
$ mv v3_bench1 images

$ make
$ ./bin/benchmarker
```

## ベンチマーカー

### 実行オプション

```
$ ./bin/benchmarker -help
Usage of isucon9q:
  -allowed-ips string
        allowed ips (comma separated)
  -data-dir string
        data directory (default "initial-data")
  -payment-port int
        payment service port (default 5555)
  -payment-url string
        payment url (default "http://localhost:5555")
  -shipment-port int
        shipment service port (default 7000)
  -shipment-url string
        shipment url (default "http://localhost:7000")
  -static-dir string
        static file directory (default "webapp/public/static")
  -target-host string
        target host (default "isucon9.catatsuy.org")
  -target-url string
        target url (default "http://127.0.0.1:8000")
```

  * HTTPとHTTPSに両対応
    * 証明書を検証するのでHTTPSは面倒
  * 外部サービス2つを自前で起動するので、いい感じにするならnginxを立てている必要がある
  * nginxでいい感じにするなら以下の設定が必須
    * `proxy_set_header Host $http_host;`
      * shipmentのみ必須
    * `proxy_set_header X-Forwarded-Proto "https";`
      * HTTPSでないなら不要
    * `proxy_set_header True-Client-IP $remote_addr;`


## 外部サービス

### 実行オプション

```
$ ./bin/shipment -help
Usage of shipment:
  -data-dir string
        data directory (default "initial-data")
```

`payment`はオプションなし。

### 注意点

nginxでいい感じにするなら以下の設定が必須

  * `proxy_set_header Host $http_host;`
    * shipmentのみ必須
  * `proxy_set_header X-Forwarded-Proto "https";`
    * HTTPSでないなら不要

## webapp 起動方法

### DB初期化

```shell-session
cd webapp/sql

# databaseとuserを初期化する
mysql -u root < 00_create_database.sql

# データを流し込む
./init.sh
```

## 使用データの取得元

- なんちゃって個人情報 http://kazina.com/dummy/
- 椅子画像提供 941-san https://twitter.com/941/status/1157193422127505412
