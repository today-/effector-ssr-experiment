import React from 'react';
import express from 'express';
import {App} from '../common/components/App';
import {renderToString} from 'react-dom/server';
import {effects, stores} from "./effects";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {

    const markup = renderToString(<App/>);

    await Promise.all(effects.map(e => e()));
    effects.length = 0;

    const preloadedState = Object.keys(stores).reduce((acc, sid) => {
      acc[sid] = stores[sid] && stores[sid].getState();
      return acc;
    }, {});

    res.send(`<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle Effector Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css
      ? `<link rel="stylesheet" href="${assets.client.css}">`
      : ''}
          ${process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`}
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
    </body>
    </html>`);
  });

export default server;
