var util = require('util');
var {Router} = require('express');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var marked = require('marked');
var yaml = require('js-yaml');
var querystring = require('querystring');

export function postsApi() {
  var router = Router()

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

  router.route('/posts')
  .get(function(req, res) {
    let r = []
    let promises = []
    fs.readdirAsync('./posts/')
    .each((file : any) => {
      return fs.readFileAsync('./posts/' + file)
      .then((a : any) => {
        r.push(yaml.load(a).title)
      })
    })
    .then(() => {
      res.json({"posts": r})
    })
  })

  return router
}

