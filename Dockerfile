FROM node:19-alpine
WORKDIR /dropdown
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build
CMD ["npm","start"]


