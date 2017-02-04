var util = require('util');
var {Router} = require('express');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var marked = require('marked');
var yaml = require('js-yaml');
var querystring = require('querystring');
var gm = require('gm');
var Rx = require('rxjs/Rx')
Promise.promisifyAll(gm.prototype);

export function photosApi() {
  var router = Router()

  let images = []

  fs.readdirAsync('./photos/')
  .each((folder : any) => {
    return fs.readdirAsync('./photos/' + folder).each((file : any) => {
      images.push('./photos/' + folder + '/' + file)
    })
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
    res.sendfile(images[req.params.id])
  })

  return router;
}

export function postsApi() {
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
    .then((files : any) => {
      files.forEach((file) => {
        return fs.readFileAsync('./posts/' + file)
        .then((a : any) => {
          if (yaml.load(a).title == req.params.post_id) {
            let r = yaml.load(a)
            marked(r.text, function (err, content) {
              r.text = content;
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
    .each((file : any) => {
      return fs.readFileAsync('./posts/' + file)
      .then((a : any) => {
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

