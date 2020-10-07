import { GW2ApiService } from './src/server/services/gw2-api.service';
import { ItemTradeListingService } from './src/server/services/Item-trade-listing.service';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { router } from 'src/server/routes';

import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CronJob } from 'cron';

// Mongoose config
const mongodbUrl = 'mongodb://localhost:27017/gw2-open-market';
mongoose.connect(mongodbUrl, { useNewUrlParser: true, keepAlive: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongodbUrl}`);
});

// Cron config
const minuteJob = new CronJob('*/15 * * * *', async () => {
  const gw2ApiService = new GW2ApiService();
  gw2ApiService.updateItemPrices();
  console.log(`Started minutely job. Started at ${new Date()}`);
});

// Run job every 15 minutes
const hourlyJob =  new CronJob('*/60 * * * *', () => {
  console.log(`Started hourly job at ${new Date()}`);
});


export function app(): express.Express {
  // The Express app is exported so that it can be used by serverless Functions.
  const server = express();
  const distFolder = join(process.cwd(), 'dist/gw2-open-market/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  server.use('/api', router);


  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // starting job
  minuteJob.start();
  hourlyJob.start();

  // on startup get all the trading data and updated listings data
  // const itemPriceService = new ItemPriceService();
  // itemPriceService.updateExistingItemPrice();
  const itemTradePriceService = new ItemTradeListingService();
  // itemTradePriceService.removeOldListings();
  // itemTradePriceService.updateAllItemTradeListing();

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
