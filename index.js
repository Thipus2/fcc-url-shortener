require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser=require('body-parser');
const res = require('express/lib/response');
var count=0;
var counterdetests=1;
var allURLs=[];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extented : true}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl", function (req, res) {
  /*const checkUrl = /(https:\/\/www\.)/
  this reges is not working as actually the tests run by FCC are testing https://xxx and not as said in the description, https://www.xxx
  so I got the next regex from search on forums to tests classic https adress and ftps
  */
  const checkUrl = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const entryurl = req.body.url;
  console.log(counterdetests+" : "+entryurl);
  counterdetests++;
  if (entryurl.match(checkUrl)) {
    count++;
    allURLs.push({short_url: count, original_url: entryurl});
    res.json({ original_url: entryurl, short_url: count});
  } else {
    res.json({ error: "invalid URL" });
  }
});
app.get("/api/shorturl/:text", (req, res) => {
  const short = parseInt(req.params["text"]);
  const urlRegistered = allURLs.find(d=> d["short_url"] == short);
  if (urlRegistered) {
    res.redirect(urlRegistered["original_url"]);
  } else {
    res.json({ error: "invalid URL" });
  }
});