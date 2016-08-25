"use strict";

let express = require('express');
let https = require('https');
let bodyParser = require('body-parser');
let util = require('util');

let app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('addons'));

app.get('/', (req, res, next) => {
  if (req.query.username === undefined) {
    res.render('index', {
      content: {
        username: '',
        results: []
      }
    });

    next();
  }
  else {
    if (req.query.page === undefined || Number(req.query.page) === NaN)
      req.query.page = 1;
    https.get(`https://api.vineapp.com/users/search/${req.query.username}?page=${req.query.page}`, (httpResponse) => {
      let str = '';

      httpResponse.on('data', (chunk) => {
        str += chunk;
      });

      httpResponse.on('end', () => {
        str = str.replace(/(["][:]\s*)(\.?\d+)(\.\d*)?/g, "$1\"$2$3\"");
        let data = JSON.parse(str).data;
        let idArr = [];

        try {
          data.records.forEach( (user) => {
            idArr.push(user.userId);
          });
        }
        catch (err) {}

        res.render('index', {
          username: req.query.username,
          userids: idArr,
          page: req.query.page,
          results: data.records || [],
          nextPage: (data.nextPage !== undefined && data.nextPage !== null) ? true : false,
          previousPage: (data.previousPage !== undefined && data.previousPage !== null) ? true : false
        });

        next();
      });
    })
  }
});

app.post('/', (req, res) => {
  res.redirect(`/?username=${req.body.username}&page=1`);
});

app.get('/vao/:userid', (req, res) => {
  https.get(`https://api.vineapp.com/timelines/users/${req.params.userid}`, (httpResponse) => {
    let str = '';

    httpResponse.on('data', (chunk) => {
      str += chunk;
    });

    httpResponse.on('end', () => {
      let links = [];
      let data = JSON.parse(str).data;

      try {
        data.records.forEach( (record) => {
          links.push(record.videoUrl);
        });
      }
      catch (err) {}

      res.render('vao', {
        userid: req.params.userid,
        links: links
      });
    });
  });
});

app.use(express.static('addons'));

app.listen(3000);
