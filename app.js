const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("6520fda219d15b001467a44a")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://kldpsh7:${process.env.MONGOPASS}@shop.iqmcj0i.mongodb.net/shop?retryWrites=true&w=majority`)
.then(()=>{
  User.findOne().then(user=>{
    if(!user){
      const user = new User({
        name:'Kuldeep Sahrma',
        email:'kldpsh77@gmail.com',
        crat:[]
      })
      user.save();
    }
  })
  app.listen(3000,()=>console.log('listening on 3000'));
}).catch(err=>console.log(err));