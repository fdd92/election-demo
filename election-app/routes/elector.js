const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { validElector, voting } = require('../src/controller/elector');
const { asyncHandler } = require('../src/exception');

const router = express.Router();

/* POST 更新选举状态 */
router.post('/check', celebrate({
  [Segments.BODY]: Joi.object().keys({
    election_id: Joi.number().min(1).integer().required(),
    email: Joi.string().max(64).email().required(),
    elector_id: Joi.string().pattern(/^[A-Z]\d{6}\(\d\)$/).required(),
  }),
}), asyncHandler(validElector));

/* POST 投票 */
router.post('/vote', celebrate({
  [Segments.BODY]: Joi.object().keys({
    election_id: Joi.number().min(1).integer().required(),
    email: Joi.string().max(64).email().required(),
    elector_id: Joi.string().pattern(/^[A-Z]\d{6}\(\d\)$/).required(),
    candidate_id: Joi.number().min(1).integer().required(),
  }),
}), asyncHandler(voting));

module.exports = router;
