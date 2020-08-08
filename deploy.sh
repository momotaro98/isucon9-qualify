#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

echo 'Building Go'
cd $DIR/webapp/go/
go build -o isucari
cp isucari /home/isucon/isucari/webapp/go/
cd $DIR
echo 'Built!'

sudo cp $DIR/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload

echo 'Updating config file...'
sudo cp "$DIR/nginx.conf/nginx.conf" /etc/nginx/nginx.conf
# sudo cp "$HOME/redis.conf" /etc/redis/redis.conf
# sudo cp "$HOME/my.conf" /etc/mysql/my.cnf
echo 'Updated config file!'

echo 'Restarting services...'
# sudo systemctl restart redis.service
# Save cache
# sudo systemctl restart mysql.service
sudo systemctl restart nginx.service
sudo systemctl restart isucari.golang.service
echo 'Restarted!'

echo 'Rotating files'
sudo bash -c 'cp /var/log/nginx/access.log /var/log/nginx/access.log.$(date +%s) && echo > /var/log/nginx/access.log; echo > /tmp/isu-query.log; echo > /tmp/isu-rack.log; test -d /tmp/stackprof && rm -f /tmp/stackprof/*; echo > /var/lib/mysql/mysql-slow.log; chown isucon:isucon /tmp/isu*.log'
echo 'Rotated!'
