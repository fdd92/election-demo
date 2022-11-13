const express = require('express');
const admin = require('../src/controller/admin');
const isAuth = require('../src/middlewares/isAuth');

const router = express.Router();

/* POST login. */
router.post('/admin/login', admin.login);

/* elections */
/* POST 创建选举 */
router.post('/elections', isAuth, admin.createElector);

/* POST 添加候选人 */
router.post('/elections/:electionId/candidates', isAuth, admin.addCandidate);

module.exports = router;
