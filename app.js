var snowflake = require('snowflake-sdk');
/**
* Module dependencies.
*/
const express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const mysql      = require('mysql');
let bodyParser=require("body-parser");
var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

connection.connect( 
  function(err, conn) {
      if (err) {
          console.error('Unable to connect: ' + err.message);
          } 
      else {
          console.log('Successfully connected to Snowflake test account.');
          // Optional: store the connection ID.
          connection_ID = conn.getId();
          }
      }
  );
 
//global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8081);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only
 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/reset', user.reset);//call for signup page
app.post('/reset', user.reset);//call for signup page
app.post('/forgot', user.forgot);//call for signup post 
//app.get('/forgot', user.forgot);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
//app.use('/home', user);
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.post('/home/profile', user.editprofile);//to render users profile
app.get('/verification/', user.verify);
//Middleware
//Middleware
app.listen(8081);