const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const webpack = require('webpack');
const cookieParser = require('cookie-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');
const atob = require('atob');

const app = express();
const compiler = webpack(WebpackConfig);
const router = express.Router();

require('./server2');

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

app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', '1234abc');
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
  })
);

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

  router.get('/extend/user', (req, res) => {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    });
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

router.get('/interceptor/get', (req, res) => {
  res.end();
});

router.post('/config/post', (req, res) => {
  res.json(req.body);
});

function registerCancelRouter() {
  router.get('/cancel/get', (req, res) => {
    setTimeout(() => {
      res.json('hello');
    }, 1000);
  });

  router.get('/cancel/post', (req, res) => {
    setTimeout(() => {
      res.json(req.body);
    }, 1000);
  });
}

registerCancelRouter();

function registerMoreRouter() {
  router.get('/more/get', (req, res) => {
    res.json(req.cookies);
  });

  router.post('/more/upload', (req, res) => {
    console.log(req.body, req.files);
    res.end('progress success!');
  });

  router.post('/more/post', (req, res) => {
    const auth = req.headers.authorization;
    const [type, credentials] = auth.split(' ');
    console.log(atob(credentials));
    const [username, password] = atob(credentials).split(':');
    if (type === 'Basic' && username === 'PYM' && password === 'ZDL') {
      res.json(req.body);
    } else {
      res.status(401);
      res.end('UnAuthorization');
    }
  });

  router.get('/more/304', (req, res) => {
    res.status(304);
    res.end();
  });

  router.get('/more/A', (req, res) => {
    res.end('A');
  });

  router.get('/more/B', (req, res) => {
    res.end('B');
  });
}

registerMoreRouter();

const port = process.env.PORT || 8000;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});
