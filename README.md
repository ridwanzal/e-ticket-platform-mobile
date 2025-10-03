# Payung Madinah Digital Agency Website

<img loading="lazy" src="https://payungmadinah.id/images/logo-main.svg" alt="Payung Madinah - Spesialis Umroh Plus !" style="width:200px;"/>

## Getting Started

Use newest version of nodejs 18.0 or upper version

## Environment setup

DB_NAME=""
DB_HOST=""
DB_USER="root"
DB_PASS=""

## Development

```js
npm i;
```

```js
npm start
```

## Open Your Browser

```
http://localhost:3000
```

## Deploying to prod

You can use pm2, forever or systemd to run the applications,
for pm2 you need to install it globally on your machine

```
npm i -g pm2
```

and run the following

```
pm2 start ./bin/app-edu
```


## Fix issue 

chown -R 1000:1000 "/root/.npm
