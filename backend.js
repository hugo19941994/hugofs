const compression = require("compression");
const express = require("express");
const fs = require("fs");
const marked = require("marked");
const sharp = require("sharp");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let images = [];
let posts = {};

async function prepare_photos() {
  const dir = `${__dirname}/photos/`;
  const folders = await readdir(dir);

  for (let folder of folders) {
    if (folder === ".gitignore") {
      continue;
    }

    let files = await readdir(`${dir}${folder}`);
    for (let file of files) {
      images.push(`${dir}${folder}/${file}`);
    }
  }
}

async function prepare_posts() {
  const dir = `${__dirname}/posts/`;
  const folders = await readdir(dir);

  for (let folder of folders) {
    const data = await readFile(`${dir}${folder}/data.json`, {
      encoding: "utf8"
    });
    let post_data = JSON.parse(data);

    const post = await readFile(`${dir}${folder}/post.md`, {
      encoding: "utf8"
    });
    marked(post, (err, content) => {
      post_data["text"] = content;

      posts[post_data.title.replace(/ /g, "_")] = post_data;
    });
  }
}

// Load photo routes (TODO: load photos directly)
try {
  prepare_photos();
  prepare_posts();
} catch (err) {
  console.log(err);
}

// Highlighting options
marked.setOptions({
  highlight: function(code) {
    return (
      '<pre class="hljs"><code>' +
      require("highlight.js").highlightAuto(code).value +
      "</code></pre>"
    );
  }
});

const app = express();

// Port
app.set("port", process.env.PORT || 3060);

// Middleware
app.use(compression());

// Endpoints
app.get("/api/photos", (req, res, next) => {
  res.json(images.length);
});

app.get("/api/photo/:id", (req, res, next) => {
  if (parseInt(req.params.id) > images.length) {
    res.sendStatus(500);
  } else {
    // Checks for webp support
    if (req.get("accept").indexOf("image/webp") > -1) {
      return sharp(images[req.params.id])
        .resize(500)
        .webp()
        .toBuffer()
        .then(data => {
          res.type("image/webp");
          res.send(data);
        });
    } else {
      return sharp(images[req.params.id])
        .resize(500)
        .jpeg({ progressive: true })
        .toBuffer()
        .then(data => {
          res.type("image/jpeg");
          res.send(data);
        });
    }
  }
});

app.get("/api/photo-original/:id", (req, res, next) => {
  res.sendFile(images[req.params.id]);
});

app.get("/api/post/:post_id", async (req, res, next) => {
  if (req.params.post_id in posts) {
    return res.json(posts[req.params.post_id]);
  } else {
    res.sendStatus(400);
  }
});

app.get("/api/posts", async (req, res, next) => {
  let r = [];

  for (let post in posts) {
    r.push({ title: posts[post].title, date: posts[post].date });
  }

  function compare(a, b) {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  }

  res.json(r.sort(compare));
});

app.listen(app.get("port"));
