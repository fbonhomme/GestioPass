const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const routes = require('./routes/index');
const users = require('./routes/users');
const mongoose = require('mongoose');

const app = express();
// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/gestiopass',{useNewUrlParser:true})
        .then(() => {console.log('MongoDB Connected ...')},
        err => {console.log(err)}
        );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*app.get('/',(req,res)=>{
    res.render('home')
})*/
app.listen(3000,()=>{console.log('connected on port 3000')})

