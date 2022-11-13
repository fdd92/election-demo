const { ElectionMapper, CandidateMapper } = require('../model/election');

// 创建选举
const create = async () => {
  const election = await ElectionMapper.create({
    stat: 1,
  });
  return election;
};

// 获取选举
async function getElection(electionId) {
  // todo: for update
  const election = await ElectionMapper.findByPk(electionId);
  // 查询选举是否存在
  if (election == null) {
    throw new Error(`找不到选举 ${electionId}。`);
  }
  return election;
}

// 添加候选人
const addCandidate = async (electionId, candidate) => {
  // 查询选举是否存在
  const election = await getElection(electionId);
  if (election.get('stat') !== 1) {
    throw new Error(`选举 ${electionId} 不是初始化状态`);
  }

  // 查询候选人是否存在
  const countCondidate = await CandidateMapper.count({
    where: {
      election_id: electionId,
      name: candidate.name,
    },
  });

  if (countCondidate > 0) {
    throw new Error(`选举 ${electionId} 选举人 ${candidate.name} 已存在。`);
  }

  // 添加候选人
  const condidateModel = await CandidateMapper.create({
    election_id: electionId,
    name: candidate.name,
  });
  return condidateModel;
};

// 结束选举
const end = async (electionId) => {
  const election = await getElection(electionId);
  if (election.get('stat') !== 2) {
    throw new Error(`选举 ${electionId} 不在进行中状态`);
  }

  election.stat = 3;
  await election.save();
};

// 开始选举
const start = async (electionId) => {
  const election = await getElection(electionId);
  if (election.get('stat') !== 1) {
    throw new Error(`选举 ${electionId} 不是初始化状态。`);
  }

  // 查询选举人数
  const count = await CandidateMapper.count({
    where: {
      election_id: electionId,
    },
  });

  if (count < 2) {
    throw new Error(`选举 ${electionId} 需要 2 个人以上才能开始。`);
  }

  election.set('stat', 2);
  await election.save();
  return election;
};

module.exports = {
  start,
  create,
  end,
  addCandidate,
};
