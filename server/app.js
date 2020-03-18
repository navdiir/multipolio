import express from 'express';
import { ready } from 'consola';
import { Nuxt, Builder } from 'nuxt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';

// Import and Set Nuxt.js options
import config from '../nuxt.config.js'
config.dev = process.env.NODE_ENV !== 'production'

async function start () {

  const app = express();
  const server = createServer(app);
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({credentials:true}))


  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(process.env.PORT || port, process.env.HOST || host)
  ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
