const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const routes = require('./routes/index');
const users = require('./routes/users');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/gestiopass', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/', routes);
app.use('/users', users);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



app.listen(3000, () => { console.log('connected on port 3000') })