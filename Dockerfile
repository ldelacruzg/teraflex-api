# Primera etapa: instalar las dependencias de desarrollo y construir la aplicación
FROM node:18 as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Segunda etapa: instalar solo las dependencias de producción
FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Tercera etapa: imagen final
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=production /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]