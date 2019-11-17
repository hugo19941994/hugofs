const { readdir, readFile } = require("fs").promises;
const marked = require("marked");
import { Router } from "express";

export let post_router = Router();
let posts = {};

try {
  prepare_posts();
} catch (err) {
  console.log(err);
  process.exit(1);
}

// Highlighting options
// TODO: Sanitize HTML
marked.setOptions({
  highlight: code => {
    return (
      '<pre class="hljs"><code>' +
      require("highlight.js").highlightAuto(code).value +
      "</code></pre>"
    );
  }
});

async function prepare_posts() {
  const dir = `${__dirname}/posts/`;
  const folders = await readdir(dir);

  for (const folder of folders) {
    // TODO: Make parallel
    const data = await readFile(`${dir}${folder}/data.json`, "utf8");
    let post_data = JSON.parse(data);

    const post = await readFile(`${dir}${folder}/post.md`, "utf8");
    marked(post, (err, content) => {
      post_data["text"] = content;
      posts[post_data.title.replace(/ /g, "_")] = post_data;
    });
  }
}

post_router.get("/api/posts", (req, res, next) => {
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

post_router.get("/api/post/:post_id", (req, res, next) => {
  if (req.params.post_id in posts) {
    res.json(posts[req.params.post_id]);
  } else {
    res.sendStatus(400);
  }
});
