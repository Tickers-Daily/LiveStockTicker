var http=require('http');
process.setMaxListeners(0)

http.createServer(function(req,res){
  res.write("penis");
  res.end();
}).listen(8080);