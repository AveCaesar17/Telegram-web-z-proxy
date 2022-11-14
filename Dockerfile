FROM ubuntu
ENV YOURDOMAIN=localhost
COPY ./hello.sh ./
RUN bash ./hello.sh
RUN \
  
  apt-get update && \
  apt-get install -y nginx && \
  apt-get install -y npm && \
  apt-get install -y nodejs && \
  apt-get install -y git && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

COPY . /Telegram
WORKDIR /Telegram

RUN sed -i "s/domain/$YOURDOMAIN/g" src/lib/gramjs/client/TelegramClient.js && \
    sed -i "s/domain/$YOURDOMAIN/g" src/lib/gramjs/extensions/PromisedWebSockets.js && \
    sed -i "s/your_domain/$YOURDOMAIN/g" src/util/websync.ts

COPY ./nginx.conf /etc/nginx/nginx.conf 
COPY ./cert.crt /etc/nginx/cert.crt
COPY ./cert.key /etc/nginx/cert.key

RUN \ 
   npm i && \
   npm run gramjs:tl full && \
   npx browserslist@latest --update-db && \
   npm run build:production 


 
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
WORKDIR /etc/nginx

ENTRYPOINT nginx -c /etc/nginx/nginx.conf -g 'daemon off;'


EXPOSE 80
EXPOSE 443
