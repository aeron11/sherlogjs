/**
 * Sherlog.js
 * Client-side error and event tracker application.
 *
 * Copyright (c) 2014 Burak Son
 * http://github.com/burakson/sherlogjs/LICENSE.md
 */

var config      = require('./config/config.json')
  , fs          = require('fs')
  , http        = require('http')
  , express     = require('express')
  , mongoose    = require('mongoose')
  , bodyParser  = require('body-parser')
  , timeout     = require('connect-timeout')
  , colors      = require('colors')
  , routes      = require('./app/routes/routes')
  , app         = express();


var db = mongoose.connect(
  'mongodb://'+ config.database.host + '/' + config.database.db_name, {
    user: config.database.user,
    pass: config.database.pw })
  .connection.on('error', function() {
    console.log('Could not connect to the database!'.red);
  });

// ensure that bower packages are installed
fs.exists('bower_components', function (exists) { 
  if (!exists) { 
    console.log('Bower packages are not installed. Please run `bower install`'.red);
    process.exit(1);
  } 
}); 

// ensure that the required gulp task is completed
fs.exists('public/js/sherlog.min.js', function (exists) { 
  if (!exists) { 
    console.log('Assets seem to be not compiled. Please run `gulp`'.red);
    process.exit(1);
  } 
}); 

// express setup
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(timeout(config.response_timeout));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('site_title', config.site_title);
app.set('views', __dirname + '/views');

// routes
app.get('/',                          routes.index);
app.get('/dashboard',                 routes.dashboard);
app.get('/dashboard/:type',           routes.dashboard);
app.get('/dashboard/details/:id',     routes.details);
app.get('/t.gif',                     routes.tracker);
app.all('*',                          routes.notfound);

app.listen( config.node_server.port, config.node_server.host, '', function() {
  console.log(('Sherlog is listening tracking requests at: '+ config.node_server.port).yellow);
});