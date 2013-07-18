
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , event = require('./routes/event')
  , people = require('./routes/people')
  , attendance = require('./routes/attendance')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// "AUTH" - not actually sessions, yet, but managing logins
app.get("/logout", auth.logout);
app.get("/register", auth.register);
app.post("/register", people.register);
//app.get("/login/:eventid", auth.loginscreen);
app.get("/login/:personid", auth.login);

// EVENTS:
//app.get("/edit-event/:personid", event.createevent);
app.get("/event/:eventid", event.get);
app.post("/event", event.newevent);
app.get("/eventlist/:tutorid", event.eventlist);
app.get("/admin/eventlist", event.eventlist);

// PEOPLE:
app.get("/admin/people", people.list);
app.get("/person/:personid", people.get); // profile

//app.get("/register/:type", people.registerForm);
//app.post("/register/:type", people.register);
app.post("/registerandcheckin", people.registerandcheckin);

// ATTENDANCE AND FEEDBACK
app.get("/checkin/:eventid", attendance.cookiecheckin); // URL from QR code
// app.all("/checkin/:eventid/:personid", attendance.checkin); // was the url from app
app.get("/feedback/:attendanceid", attendance.leavefeedback);
app.post("/feedback", attendance.feedback); // attendanceid passed in POST body
app.post("/feedback/:attendanceid", attendance.feedback);
app.get("/attended/:personid", attendance.attended);
app.get("/attendees/:eventid", attendance.attendees);
app.get("/attendance/:attendanceid", attendance.get);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
