var express = require("express");
var reload = require('reload');
var app = express();
const localport = 3000;

app.set('port', process.env.PORT || localport);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = "Michael Coons";

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/projects'));
app.use(require('./routes/photography'));
app.use(require('./routes/contact'));

var server = app.listen(app.get('port'), function(){
    console.log("listening on port: " + app.get('port'));
});

reload(server, app);