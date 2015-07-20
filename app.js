var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');

function getfiles(){
  return fs.readdirSync(__dirname + '/dist');
}

var http = require('http').Server(app);

app.use("/dist",express.static('dist'));

// app.get('/',function(req,res) {
// 	res.sendFile(__dirname + '/index.html');
// });

app.get('/',function(req,res){
  var html = "<html><body><ul>";

var logs = getfiles();

for(var i = 0;i<logs.length;i++){
	html += "<li><a href='/dist/" + logs[i] + "'>" + logs[i] + "</a></li>";
}


  html += "</ul></body></html>";
	res.send(html);
});

http.listen(3031, function() {
   console.log('listening *:3031');
});