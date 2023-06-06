FROM node:14-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install -g serve
#todo: find a way to not include dependencies in final build?
COPY . ./
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "build"]
