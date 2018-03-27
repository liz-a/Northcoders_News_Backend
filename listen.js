const app = require('./app');

const { PORT } = require('./config');

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});