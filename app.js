var express = require('express');
var app = express();
var fs = require('fs');


var dirName = process.argv[2];

console.log('distributing', dirName);


app.set('view engine', 'ejs');

function getfiles(folder){
  //return fs.readdirSync(dirName);
  return getFilesRecursive(dirName + (folder?'/' + folder :''));
}
function getFilesRecursive (folder) {
    var fileContents = fs.readdirSync(folder),
        fileTree = [],
        stats;

    fileContents.forEach(function (fileName) {
        stats = fs.lstatSync(folder + '/' + fileName);

        if (stats.isDirectory()) {
            fileTree.push({
                name: fileName,
                isDir:true,
                children: getFilesRecursive(folder + '/' + fileName)
            });
        } else {
            fileTree.push({
                name: fileName
            });
        }
    });

    return fileTree;
};

var http = require('http').Server(app);

app.use("/dist",express.static(dirName));

// app.get('/',function(req,res) {
// 	res.sendFile(__dirname + '/index.html');
// });

app.get('/',function(req,res){
  var html = "<html><body><ul>";

var fld = (req.query.folder?req.query.folder + '/' :'');

var logs = getfiles(req.query.folder);

for(var i = 0;i<logs.length;i++){
  if(logs[i].isDir){
     html += "<li><a href='/?folder=" + fld + logs[i].name + "'>" + logs[i].name + "</a></li>";
  }else{
    	html += "<li><a href='/dist/" + fld + logs[i].name + "'>" + logs[i].name + "</a></li>";
  }
}


  html += "</ul></body></html>";
	res.send(html);
});

http.listen(3031, function() {
   console.log('listening *:3031');
});

var localtunnel = require('localtunnel');

var tunnel = localtunnel(3031, {'subdomain':'efaredist'}, function(err, tunnel) {
    if (err) throw err

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
   console.log(tunnel.url);
});

tunnel.on('close', function() {
    // tunnels are closed
    console.log('tunnel closed');
});