#!/bin/bash
sudo pkill snort
sudo pkill gateway
sudo pkill node
rm -f /home/pi/snort_logs/alert
#rm -f /home/pi/sentinel-gateway/listener/receive.txt
sudo snort -N -A full -d -D -l /home/pi/snort_logs -L test.log -s -c /etc/snort/rules/my_rule.rules 
#touch /home/pi/sentinel-gateway/listener/receive.txt
#sudo npm start --prefix /home/pi/sentinel-gateway/listener &
sudo /home/pi/sentinel-gateway/gateway config.json
wget --no-check-certificate http://mirror.pnl.gov/releases/17.04/ubuntu-17.04-beta2-desktop-amd64.iso
