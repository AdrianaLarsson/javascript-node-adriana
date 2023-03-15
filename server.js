const http = require("http");
var fs = require("fs");

const hostname = "127.0.0.1";
const port = 3000;

//reading html file in public
fs.readFile("./public/index.html", (error, html) => {
  if (error) {
    console.error("Something went wrong when read the html file", error);
    return;
  }
  //create the server
  http
    .createServer(function (_, response) {
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(html);
      response.end();
    }) //running the server
    .listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
});
