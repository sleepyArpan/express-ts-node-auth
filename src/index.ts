import express from 'express';
import dotEnv from 'dotenv';
import routes from './routes';
import * as middlewares from './middlewares';

dotEnv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(middlewares.notFoundHandler);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
