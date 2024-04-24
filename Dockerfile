FROM node:latest
COPY . /app
CMD ["node","/app/index.js"]