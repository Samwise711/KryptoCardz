const { createServer } = require('http');
const next = require('next');
const app = next({
  dev: process.env.NODE_ENV !== 'production',
  conf: {
    webpack: config => {
      config.devtool = false;
      config.node = {
      fs: 'empty',
      child_process: 'empty'
      };

      for (const r of config.module.rules) {
        if (r.loader === 'babel-loader') {
          r.options.sourceMaps = false;
        }
      }

      config.module.rules.push({        //epic hack!!!!!
      test: /\.(png|jpg)$/,
       loader: 'url-loader?limit=8192'
     })

      return config;
    }
  }
  //something here about !

});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3000, err => {
    if (err) throw err;
    console.log('Ready on localhost:3000');
  });
});
