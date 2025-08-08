FROM node:24.1.0

#  build using npm 

WORKDIR /app

COPY package.json . 

RUN npm install 

COPY . .

EXPOSE 8000

CMD ["npm","start"]
# will go to package.json and will run the start script