FROM mysql:5.7

ENV MYSQL_DATABASE=election \
    MYSQL_ROOT_PASSWORD=develop

ADD init.sql /docker-entrypoint-initdb.d
ADD mysql.cnf /etc/mysql/conf.d

EXPOSE 3306