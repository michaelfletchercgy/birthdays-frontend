FROM library/debian:testing AS builder

# Add the HTTPS transport
RUN apt-get update
RUN apt-get install -y ca-certificates apt-transport-https gnupg curl

# Add the node key
#RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

# Add node
RUN curl -sL https://deb.nodesource.com/setup_8.x a | bash
RUN apt-get update

# Install all the things.
RUN apt-get install -y nodejs pkg-config unzip

# Now Compile
COPY . /build
WORKDIR /build
RUN npm update
RUN npm run build


FROM nginx:1.13.8
LABEL author="Michael Fletcher <m.fletcher@theplanet.ca>"

COPY --from=builder /build/build /usr/share/nginx/html