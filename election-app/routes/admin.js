const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const admin = require('../src/controller/admin');
const isAuth = require('../src/middlewares/isAuth');
const { eventEmitter } = require('../src/event');
const { client } = require('../src/cache');

const router = express.Router();

/* POST login. */
router.post('/admin/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    account: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), admin.login);

/* elections */
/* POST 创建选举 */
router.post('/elections', isAuth, admin.createElector);

/* PUT 更新选举状态 */
router.put('/elections/:electionId', isAuth, admin.updateElection);

/* GET 查看候选详情 */
router.get('/elections/:electionId', isAuth, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
  }),
}), admin.electionDetail);

/* POST 添加候选人 */
router.post('/candidates', isAuth, celebrate({
  [Segments.BODY]: Joi.object().keys({
    electionId: Joi.number().min(1).integer().required(),
  }),
}), admin.addCandidate);

/* POST 查看候选人选票明细 */
router.get('/candidates/:candidateId', isAuth, celebrate({
  [Segments.BODY]: Joi.object().keys({
    page: Joi.number().min(1).integer().required(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    candidateId: Joi.number().min(1).integer().required(),
  }),
}), admin.queryCandidateDetail);

router.get('/test', async (req, res) => {
  eventEmitter.emit('election-end', {
    electionId: 151,
  });
  res.json({ message: 'success' });
});

router.get('/test1', async (req, res) => {
  await client.set('a', 1);
  res.json({ message: 'success' });
});

module.exports = router;
