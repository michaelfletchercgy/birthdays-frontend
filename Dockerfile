FROM nginx:1.13.8
LABEL author="Michael Fletcher <m.fletcher@theplanet.ca>"

COPY build /usr/share/nginx/html