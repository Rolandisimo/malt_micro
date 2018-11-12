import Express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import cors from 'cors';
import cookieSession from 'cookie-session';

import Routes from '@config/Routes';
import '@config/sequelize';
import Environment from '@config/Environment';
import { throwMigrationError } from '@config/sequelize';


if (Environment.env === 'development') {
  throwMigrationError();
}

const app = Express();
app.use(bodyParser.json());

app.use(morgan('combined'));
if (Environment.env === 'development') {
  morganBody(app);
}

// Configure Session
app.use(cookieSession({
  name: 'maltUserSession',
  keys: Environment.session.keys,
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
}));


// Setup CORS
const originsWhitelist = [
  'http://localhost:8080',
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted); // tslint:disable-line
  },
  credentials: true,
};
app.use(cors(corsOptions));


// log error
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  next(err)
});

app.use('/', Routes);

module.exports = app;