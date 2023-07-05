FROM node:19-alpine as development

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install

RUN npm start

CMD ["npm", "run", "typeorm", "migration:run"] 
