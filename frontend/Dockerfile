FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g @angular/cli@19
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]