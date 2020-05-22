#! /bin/bash
source ~/.bash_profile

# Not needed because sizes can be retrived directly from rsync logs 
#centos_size=`du -sh /mirrors/centos/ | awk '{print $1}'`
#epel_size=`du -sh /mirrors/epel/ | awk '{print $1}'`
#ubuntu_size=`du -sh /mirrors/ubuntu/ | awk '{print $1}'`
#pypi_size=`du -sh /mirrors/pypi/ | awk '{print $1}'`

#tunasynctl set-size -w worker centos $centos_size
#tunasynctl set-size -w worker epel $epel_size
#tunasynctl set-size -w worker ubuntu $ubuntu_size
#tunasynctl set-size -w worker pypi $pypi_size

#sleep 5

mv /mirrors/jobs.json /mirrors/jobs.json.bak
wget -c http://localhost:14242/jobs -O /mirrors/jobs.json -o /mirrors/log/plog/wget.log
