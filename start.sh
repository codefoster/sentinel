sudo kill -9 `pidof snort` 
sudo kill -9 `pidof gateway`
rm -f /home/pi/snort_logs/alert
sudo snort -N -A full -d -D -l /home/pi/snort_logs -L test.log -s -c /etc/snort/rules/my_rule.rules 
#sudo npm start --prefix /home/pi/sentinel-gateway/listener &
sudo /home/pi/sentinel-gateway/gateway config.json
