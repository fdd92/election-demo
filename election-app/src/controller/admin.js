const console = require('console');
const adminService = require('../service/admin');
const electionService = require('../service/election');

// 管理员登录
const login = async (req, res) => {
  console.log(req.body);
  const { account, password } = req.body;
  const token = await adminService.login(account, password);

  res.json({
    token,
  });
};
// 管理员查询选举

// 创建选举
const createElector = async (req, res) => {
  const election = await electionService.create();
  res.status('201').json({
    electionId: election.election_id,
  });
};

// 添加候选人
const addCandidate = async (req, res) => {
  const { electionId } = req.params;
  const condidate = await electionService.addCandidate(electionId, {
    name: req.body.name,
  });
  res.status('201').json({
    condidate,
  });
};

// 更新选举
const updateElection = async (req, res) => {
  const { electionId } = req.params;
  const { action } = req.body;

  let election;
  if (action === 1) {
    election = await electionService.start(electionId);
  } else if (action === 2) {
    election = await electionService.end(electionId);
  } else {
    throw new Error('错误的操作');
  }

  res.status('200').json({
    election,
  });
};

module.exports = {
  login,
  createElector,
  addCandidate,
  updateElection,
};