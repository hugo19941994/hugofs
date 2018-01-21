var util = require('util');
var {Router} = require('express');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var marked = require('marked');
var yaml = require('js-yaml');
var querystring = require('querystring');
var gm = require('gm');
var Rx = require('rxjs/Rx')
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
Promise.promisifyAll(gm.prototype);

function photosApi() {
  var router = Router()

  let images = []

  fs.readdirAsync(__dirname + '/photos/')
  .each((folder) => {
    if (folder !== ".gitignore") {
      return fs.readdirAsync(__dirname + '/photos/' + folder).each((file) => {
        images.push(__dirname + '/photos/' + folder + '/' + file)
      })
    }
  })

  router.route('/photos')
  .get(function(req, res) {
    res.json(images.length)
  })

  router.route('/photo/:id')
  .get(function (req, res) {
    if (parseInt(req.params.id) > images.length){
      res.sendStatus(500)
    }
    else {
      return gm(images[req.params.id]).autoOrient().resize(500).toBufferAsync('jpg').then((data) => {
        res.json({photo: data.toString('base64'), num: req.params.id})
      })
    }
  })

  router.route('/bigphoto/:id')
  .get(function (req, res) {
    res.sendFile(images[req.params.id])
  })

  return router;
}

function postsApi() {
  var router = Router()

  marked.setOptions({
    highlight: function(code) {
      return '<pre class="hljs"><code>' +
               require('highlight.js').highlightAuto(code).value +
               '</code></pre>';
    }
  });

  router.route('/post/:post_id')
  .get(function (req, res) {
    return fs.readdirAsync('./posts/')
    .then((files) => {
      files.forEach((file) => {
        return fs.readFileAsync('./posts/' + file)
        .then((a) => {
          if (yaml.load(a).title == req.params.post_id.replace(/_/g, ' ')) {
            let r = yaml.load(a)
            marked(r.text, function (err, content) {
              r.text = content;
                //console.log(err)
              res.json(r)
            })
          }
        })
      })
    })
  })

  function compare(a, b) {
    if (a.date < b.date)
      return 1;
    if (a.date > b.date)
      return -1;
    return 0;
  }

  router.route('/posts')
  .get(function(req, res) {
    let r = []
    fs.readdirAsync('./posts/')
    .each((file) => {
      return fs.readFileAsync('./posts/' + file)
      .then((a) => {
        let doc = yaml.load(a)
        r.push({"title": doc.title, "date": doc.date})
      })
    })
    .then(() => {
      res.json(r.sort(compare))
    })
  })

  return router
}

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

app.set('port', process.env.PORT || 3060);
app.use(bodyParser.json());
app.use(compression());

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  next();
}

app.use('/api', postsApi());
app.use('/photosApi', photosApi());
app.listen(3060)
