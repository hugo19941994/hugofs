import { readdir, readFile } from "fs/promises";
import marked from "marked";
import { Router } from "express";
import { stderr, exit } from "process";

export let postRouter = Router();
const posts = {};

try {
  prepare_posts();
} catch (err) {
  stderr.write(`${err}\n`);
  exit(1);
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
    const postData = JSON.parse(data);

    const post = await readFile(`${dir}${folder}/post.md`, "utf8");
    marked(post, (err, content) => {
      postData.text = content;
      posts[postData.title.replace(/ /g, "_")] = postData;
    });
  }
}

postRouter.get("/api/posts", (req, res, next) => {
  const reply = [];

  for (const post in posts) {
    if (posts.hasOwnProperty(post)) {
      reply.push({ title: posts[post].title, date: posts[post].date });
    }
  }

  function compare(a, b) {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  }

  res.json(reply.sort(compare));
});

postRouter.get("/api/post/:post_id", (req, res, next) => {
  if (req.params.post_id in posts) {
    res.json(posts[req.params.post_id]);
  } else {
    res.sendStatus(400);
  }
});
