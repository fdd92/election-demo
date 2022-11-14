const console = require('console');
const adminService = require('../service/admin');
const electionService = require('../service/election');
const { eventEmitter } = require('../event');
const { BussErr } = require('../exception');

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
  const { electionId } = req.body;
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

  // 操作分流
  let election;
  if (action === 1) {
    // 开始选举
    election = await electionService.start(electionId);
  } else if (action === 2) {
    // 结束选举
    election = await electionService.end(electionId);
    eventEmitter.emit('election-end', {
      electionId: election.get('election_id'),
    });
  } else {
    throw new BussErr('错误的操作');
  }

  res.status('200').json({
    election,
  });
};

// 候选详情
const electionDetail = async (req, res) => {
  const { electionId } = req.params;

  // 查询
  const detail = await electionService.queryElectionDetail(electionId);
  res.status('200').json({
    detail,
  });
};

// 候选人选票详情
const queryCandidateDetail = async (req, res) => {
  const { candidateId } = req.params;
  const { page } = req.body;

  // 查询
  const detail = await electionService.queryCandidateDetail(candidateId, page);
  res.status('200').json({
    detail,
  });
};

module.exports = {
  login,
  createElector,
  addCandidate,
  updateElection,
  electionDetail,
  queryCandidateDetail,
};
