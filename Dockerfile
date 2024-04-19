FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -platform=linuxmusl
COPY . .
RUN npm run build:prd

### STAGE 2: Run ###
FROM nginx:1.13.12-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/nub /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]