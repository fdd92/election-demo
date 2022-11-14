FROM mysql:5.7

ADD init.sql /docker-entrypoint-initdb.d
ADD mysql.cnf /etc/mysql/conf.d

EXPOSE 3306
