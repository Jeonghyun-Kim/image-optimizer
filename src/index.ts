import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as http from 'http';

import indexRouter from './v1';

const app = express();

app.use(morgan('dev'));

app.use(express.static('./public'));
app.use(bodyParser.json());

app.use('/', indexRouter);

app.all('*', (_req, _res, next) => {
  const error = new Error('404 NOT FOUND') as any;
  error.status = 404;

  return next(error);
});

app.use((err: any, _req: express.Request, res: express.Response) => {
  return res.status(err.status || 500).json({
    error: 'INTERNAL SERVER ERROR',
  });
});

http.createServer(app).listen(8080, () => {
  console.log('HTTP SERVER LISTENING ON PORT 8080');
});
