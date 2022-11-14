const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { isCelebrateError } = require('celebrate');
const { eventEmitter } = require('./src/event');
const { sendElectionResult } = require('./src/job/notice');
const { BussErr } = require('./src/exception');

const adminRouter = require('./routes/admin');
const electorRouter = require('./routes/elector');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminRouter);
app.use('/elector', electorRouter);

// error handling
app.use((err, req, res) => {
  if (isCelebrateError(err)) {
    // 获取错误消息
    let { message } = err;
    if (err?.details?.get('body')) {
      message = err.details.get('body').message;
    } else if (err?.details.get('params')) {
      message = err.details.get('params').message;
    }

    res.status('400').json({
      message,
    });
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).json({ msg: 'token 校验失败' });
  } else if (err instanceof BussErr) {
    res.status(err.code).json({ msg: err.message });
  } else {
    res.status(500).json({ msg: '服务器错误。' });
  }
});

// 配置事件回调
eventEmitter.on('election-end', sendElectionResult);

module.exports = app;
