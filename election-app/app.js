const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { isCelebrateError } = require('celebrate');

const events = require('events');

const eventEmitter = new events.EventEmitter();

const adminRouter = require('./routes/admin');
const electorRouter = require('./routes/elector');

const app = express();

app.set('eventEmitter', eventEmitter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ msg: 'token 校验失败' });
  } else {
    next(err);
  }
});

// celebrate error handling
const celebrateErrorHandling = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    // 获取错误消息
    let { message } = err;
    if (err?.details?.get('body')) {
      message = err.details.get('body').message;
    } else if (err?.details.get('params')) {
      message = err.details.get('params').message;
    }

    return res.status('400').json({
      message,
    });
  }

  return next(err);
};

app.use('/', adminRouter);
app.use('/elector', electorRouter);
app.use(celebrateErrorHandling);

module.exports = app;
