const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const mongoose = require('mongoose');
const index = require('./routes/index');
const users = require('./routes/users');
const flash = require('connect-flash');
const session = require('express-session');

//const passport = require('passport');

const app = express();

// Passport Config
//require('./config/passport')(passport);

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/gestiopass', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: false
    })
  );

// Passport middleware
//app.use(passport.initialize());
//app.use(passport.session());
  
// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.use('/', index);
app.use('/users', users);

app.listen(3000, () => { console.log('connected on port 3000') })