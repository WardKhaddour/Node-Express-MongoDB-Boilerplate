const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION !!!💣️💣️ Shutting Down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION !!!💣️💣️ Shutting Down ...');
  console.log(err.name, err.message);
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
