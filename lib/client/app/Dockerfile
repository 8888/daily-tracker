# Stage 1: Build Angular app
FROM node:16.15-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run Angular app
FROM nginx:1.21.6-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/daily-tracker /usr/share/nginx/html
