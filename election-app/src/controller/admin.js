const console = require('console');
const adminService = require('../service/admin');
const electionService = require('../service/election');

// 管理员登录
const login = async (req, res) => {
  console.log(req.body);
  const { account, password } = req.body;
  const token = await adminService.login(account, password);

  res.json({
    msg: 'success',
    data: {
      token,
    },
  });
};
// 管理员查询选举

// 创建选举
const createElector = async (req, res) => {
  const election = await electionService.create();
  res.status('201').json({
    msg: 'success',
    data: {
      electionId: election.election_id,
    },
  });
};

// 添加候选人
const addCandidate = async (req, res) => {
  const { electionId } = req.params;
  const condidate = await electionService.addCandidate(electionId, {
    name: req.body.name,
  });
  res.status('201').json({
    msg: 'success',
    data: {
      condidate,
    },
  });
};

// 开启选举

// 结束选举

module.exports = {
  login,
  createElector,
  addCandidate,
};
