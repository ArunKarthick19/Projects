FROM ubuntu:12.04

RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://old-releases.ubuntu.com/ubuntu/|g' /etc/apt/sources.list && \
    sed -i 's|http://security.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
    apache2 \
    build-essential \
    wget \
    zlib1g-dev \
    php5 \
    libapache2-mod-php5 \
    php5-curl

RUN a2enmod php5

RUN wget --no-check-certificate \
    https://www.openssl.org/source/old/1.0.1/openssl-1.0.1f.tar.gz && \
    tar -xzf openssl-1.0.1f.tar.gz && \
    cd openssl-1.0.1f && \
    ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared && \
    make && make install

RUN echo "/usr/local/ssl/lib" > /etc/ld.so.conf.d/openssl.conf && ldconfig

RUN mkdir -p /etc/apache2/ssl

RUN /usr/local/ssl/bin/openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/server.key \
    -out /etc/apache2/ssl/server.crt \
    -subj "/C=SG/ST=Singapore/L=Singapore/O=TestBank/CN=localhost"

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN a2enmod ssl

COPY ssl.conf /etc/apache2/sites-available/default-ssl
RUN a2ensite default-ssl
COPY index.html /var/www/html/index.html
COPY dashboard.html /var/www/html/dashboard.html
COPY heartbleed_test.php /var/www/html/heartbleed_test.php
COPY backend.php /var/www/html/backend.php
COPY admin.html /var/www/html/admin.html
COPY passwordreset.html /var/www/html/passwordreset.html

RUN mkdir -p /var/run/apache2 /var/lock/apache2 /var/log/apache2 && \
    chmod 755 /var/run/apache2 /var/lock/apache2 /var/log/apache2

EXPOSE 443
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
