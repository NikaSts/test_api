import express from 'express';
import {userRouter} from './users/users.js';

const app = express();
const port = 8000;

app.use((req, res, next) => {
  console.log('time', Date.now());
  next();
})

app.get('/', (req, res) => {
  res.end();
});

app.use('/users', userRouter);

app.get('/err', (req, res) => {
  throw new Error('Error!');
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});
