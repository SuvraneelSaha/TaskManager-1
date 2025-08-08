FROM node:24.1.0

WORKDIR /app

COPY package.json . 

# . meaning work dir folder 

RUN npm install 

COPY . .
# copy frontend src 

EXPOSE 5173 
# app will run on this port - ie react app 

CMD ["npm","run","dev"]
# will go to package.json and will run dev 



