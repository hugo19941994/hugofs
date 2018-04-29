const compression = require('compression');
const express = require('express');
const fs = require('fs');
const marked = require('marked');
const sharp = require('sharp');
const util = require('util');
const yaml = require('js-yaml');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let images = []

async function prepare_photos() {
  const dir = `${__dirname}/photos/`
  const folders = await readdir(dir);

  for (let folder of folders) {
    if (folder === '.gitignore') {
      continue;
    }

    let files = await readdir(`${dir}${folder}`);
    for (let file of files) {
      images.push(`${dir}${folder}/${file}`);
    }
  }
}

// Load photo routes (TODO: load photos directly)
try {
  prepare_photos();
} catch (err) {
  console.log(err)
}

// Highlighting options
marked.setOptions({
  highlight: function(code) {
    return '<pre class="hljs"><code>' +
      require('highlight.js').highlightAuto(code).value +
      '</code></pre>';
  }
});

const app = express();

// Port
app.set('port', process.env.PORT || 3060);

// Middleware
app.use(compression());

// Endpoints
app.get('/photosApi/photos', (req, res, next) => {
  res.json(images.length);
});

app.get('/photosApi/photo/:id', (req, res, next) => {
  if (parseInt(req.params.id) > images.length) {
    res.sendStatus(500);
  }
  else {
    // Checks for webp support
    if (req.get('accept').indexOf('image/webp') > -1) {
      return sharp(images[req.params.id]).resize(500).webp().toBuffer().then(data => {
        res.json({photo: data.toString('base64'), num: req.params.id})
      });
    } else {
      return sharp(images[req.params.id]).resize(500).jpeg({progressive: true}).toBuffer().then(data => {
        res.json({photo: data.toString('base64'), num: req.params.id})
      });
    }
  }
});

app.get('/photosApi/bigphoto/:id', (req, res, next) => {
  res.sendFile(images[req.params.id]);
});

// TODO: Load posts and highlight beforehand
app.get('/api/post/:post_id', async (req, res, next) => {
  const posts = await readdir('./posts');
  let found = false;

  for (let file of posts) {
    const post = await readFile(`./posts/${file}`);
    let r = yaml.load(post);

    if (r.title === req.params.post_id.replace(/_/g, ' ')) {
      marked(r.text, (err, content) => {
        found = true;
        r.text = content;
        return res.json(r);
      });
    }
  }

  if (!found) res.sendStatus(400);
});

app.get('/api/posts', async (req, res, next) => {
  let r = [];

  const posts = await readdir('./posts');

  for (let file of posts) {
    const post = await readFile(`./posts/${file}`);
    let doc = yaml.load(post);
    r.push({"title": doc.title, "date": doc.date});
  }

  function compare(a, b) {
    if (a.date < b.date)
      return 1;
    if (a.date > b.date)
      return -1;
    return 0;
  }

  res.json(r.sort(compare));
})

app.listen(app.get('port'));
