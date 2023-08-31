const express = require('express');
const { create } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const passport = require('./config/passport');
const router = require('./routes/index');
const resVarHandler = require('./middlewares/res-var-handler');
const errHandler = require('./middlewares/error-handler');

const app = express();
const hbs = create({
  extname: '.hbs',
  helpers: { 
    toJsonStr: (context) => JSON.stringify(context),
    formAction: (record) => record ? `/records/${record.id}?_method=PUT` : '/records',
    formTitle: (record) => record ? '請修改你的支出' : '請輸入你的支出',
    formSelect: (category, record) => {
      if (!record) return !category ? 'selected' : '';
      return category === record.categoryId ? 'selected' : ''; 
    },
    formSubmitBtn: (record) => record ? '送出' : '新增支出',
  },
});
const PORT = process.env.APP_PORT || 3000;

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');
// Hide server information for security reason
app.disable('x-powered-by');

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(resVarHandler);
app.use(router);
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});