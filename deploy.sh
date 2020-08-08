#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

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
