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
  res.render('index', {
    content: {
      username: '',
      results: []
    }
  });

  next();
});

app.post('/', (req, vineRes, next) => {
  https.get(`https://api.vineapp.com/users/search/${req.body.username}`, (res) => {
    let str = '';

    res.on('data', (chunk) => {
      str += chunk;
    });

    res.on('end', () => {
      str = str.replace(/([:\s]+)(\.?\d+)(\.\d*)?/g, "$1\"$2$3\"");

      vineRes.render('index', {
        content: {
          username: req.body.username,
          results: JSON.parse(str).data.records || [],
        }
      });

      next();
    });
  });
});

app.listen(3000);
