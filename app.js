const express = require('express');
const { create } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const router = require('./routes/index');
const resVarHandler = require('./middlewares/res-var-handler');
const errHandler = require('./middlewares/error-handler');

const app = express();
const hbs = create({
  extname: '.hbs',
  helpers: { toJsonStr: (context) => JSON.stringify(context) },
});
const PORT = process.env.APP_PORT || 3000;

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');
// Hide server information for security reason
app.disable('x-powered-by');

app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(resVarHandler);
app.use(router);
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});