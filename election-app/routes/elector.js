const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { validElector, voting } = require('../src/controller/elector');
const { asyncHandler } = require('../src/exception');

const router = express.Router();

/* POST 更新选举状态 */
router.post('/check', celebrate({
  [Segments.BODY]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
    email: Joi.string().max(64).email().required(),
    electorId: Joi.string().pattern(/^[A-Z]\d{6}\(\d\)$/).required(),
  }),
}), asyncHandler(validElector));

/* POST 投票 */
router.post('/votes', celebrate({
  [Segments.BODY]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
    email: Joi.string().max(64).email().required(),
    electorId: Joi.string().pattern(/^[A-Z]\d{6}\(\d\)$/).required(),
    candidateId: Joi.number().min(1).integer().required(),
  }),
}), asyncHandler(voting));

module.exports = router;
