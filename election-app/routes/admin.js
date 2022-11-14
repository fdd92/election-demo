const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const admin = require('../src/controller/admin');
const isAuth = require('../src/middlewares/isAuth');
const { asyncHandler } = require('../src/exception');

const router = express.Router();

/* POST login. */
router.post('/admin/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    account: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), asyncHandler(admin.login));

/* elections */
/* POST 创建选举 */
router.post('/elections', isAuth, asyncHandler(admin.createElector));

/* PUT 更新选举状态 */
router.put('/elections/:electionId', isAuth, asyncHandler(admin.updateElection));

/* GET 查看候选详情 */
router.get('/elections/:electionId', isAuth, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
  }),
}), asyncHandler(admin.electionDetail));

/* POST 添加候选人 */
router.post('/candidates', isAuth, celebrate({
  [Segments.BODY]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
  }),
}), asyncHandler(admin.addCandidate));

/* POST 查看候选人选票明细 */
router.get('/candidates/:candidateId', isAuth, celebrate({
  [Segments.BODY]: Joi.object().keys({
    page: Joi.number().min(1).integer().required(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    candidateId: Joi.number().min(1).integer().required(),
  }),
}), asyncHandler(admin.queryCandidateDetail));

module.exports = router;
