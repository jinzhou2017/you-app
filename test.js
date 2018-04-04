/**
 * Created by Administrator on 2018/1/30.
 */
const express = require('express');
const app = express();
const opn = require('opn')
const path = require("path");
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const ws = require('ws');
const proxy = require('express-http-proxy');
const devMiddleWare = require('webpack-dev-middleware');
const hotMiddleWare = require('webpack-hot-middleware');
const webpack = require('webpack');
const config = require('./config');
const request = require('request');
const webPackConfig = require('./build/webpack.dev.conf');
const url = 'https://api.douban.com';
const  compiler = webpack(webPackConfig);
const instance = devMiddleWare(compiler, {
  publicPath: webPackConfig.output.publicPath,
  quiet: true,
  noInfo: true,
})
const hotInstance = hotMiddleWare(compiler, {
  log: false,
  heartbeat: 2000
})
const wss = new ws.Server({port: 8080})
wss.on('connection', (w) => {
  w.on('message', (msg) => {
    if(msg === '电影') {
      request({
        url: 'https://api.douban.com/v2/movie/in_theaters',
        method: 'get'
      }, (err, res, body) => {
        w.send(body)
      })
      return
    }

    w.send(msg)
  })

})
app.use(instance)
app.use(hotInstance);
/*app.use(express.static('./static'))*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));
/*app.use(express.static('/'))*/
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))
app.use('/api', proxy(url));
/*
app.get('/', (res, req) => {
  req.sendFile('/dev/index.html')
})
*/

app.post('/file_upload', (req, res) => {
  let des_file = __dirname + "/img/" + req.files[0].originalname;
  fs.readFile( req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      }else{
        response = {
          message:'File uploaded successfully',
          filename:req.files[0].originalname
        };
      }
      console.log( response );
      res.end( JSON.stringify( response ) );
    });
  });

})
instance.waitUntilValid(() => {
  const sever = app.listen(8087, () => {
    console.log('start sever');
    opn('http://localhost:8087/')
  })
})


