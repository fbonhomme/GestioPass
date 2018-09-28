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
        .then(() => console.log('MongoDB Connected ...'))
        .catch(err => console.log(err))

// Load User Model

require('./models/user');
const User = mongoose.model('User');   

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.post('/users',(req, res) => {
   let errors = [];
   if(!req.body.email){
       errors.push({text: "Stop!!! email please !!!"});
   }
   if(errors.length > 0){
       res.render('register', {
           errors : errors,
           email: req.body.email
       })
   } else{
       res.send('passed');
   }
});


app.listen(3000,()=>{console.log('connected on port 3000')})