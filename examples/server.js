const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');

const app = express();
const compiler = webpack(WebpackConfig);
const router = express.Router();

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
);

app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

function registerExtendRouter() {
  router.get('/extend/get', (req, res) => {
    res.json({
      msg: 'hello world'
    });
  });

  router.options('/extend/options', (req, res) => {
    res.end();
  });

  router.delete('/extend/delete', (req, res) => {
    res.end();
  });

  router.head('/extend/head', (req, res) => {
    res.end();
  });

  router.patch('/extend/patch', (req, res) => {
    res.end();
  });

  router.post('/extend/post', (req, res) => {
    res.json(req.body);
  });

  router.put('/extend/put', (req, res) => {
    res.json(req.body);
  });
}

router.get('/simple/get', (req, res) => {
  res.json({
    msg: 'hello world'
  });
});

router.get('/base/get', (req, res) => {
  res.json(req.query);
});

router.post('/base/buffer', (req, res) => {
  const msg = [];
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk);
    }
  });
  req.on('end', () => {
    const buf = Buffer.concat(msg);
    res.json(buf.toJSON());
  });
});

router.post('/base/post', (req, res) => {
  res.json(req.body);
});

router.get('/error/get', (req, res) => {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    });
  } else {
    res.status(500);
    res.end();
  }
});

router.get('/error/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    });
  }, 3000);
});

registerExtendRouter();

const port = process.env.PORT || 8000;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});
