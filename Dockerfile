FROM node:16-alpine AS build
WORKDIR /app
COPY package.json  package-lock.json /app/
COPY public /app/public
COPY src /app/src
RUN npm ci
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon-off;" ]
