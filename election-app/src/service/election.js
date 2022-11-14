const { ElectionMapper, CandidateMapper, VoteMapper } = require('../model/election');
const electionRepository = require('../repository/election');
const sequelize = require('../db');
const { BussErr } = require('../exception');

// 创建选举
const create = async () => {
  const election = await ElectionMapper.create({
    stat: 1,
  });
  return election;
};

// 添加候选人
const addCandidate = async (electionId, candidate) => {
  // 查询选举是否存在
  const condidateModel = await sequelize.transaction(async (t) => {
    const election = await electionRepository.getElection(electionId);
    if (election.get('stat') !== 1) {
      throw new BussErr(`选举 ${electionId} 不是初始化状态`);
    }

    // 查询候选人是否存在
    const countCondidate = await CandidateMapper.count({
      where: {
        election_id: electionId,
        name: candidate.name,
      },
    });

    if (countCondidate > 0) {
      throw new BussErr(`选举 ${electionId} 选举人 ${candidate.name} 已存在。`);
    }

    // 添加候选人
    const condidateModelT = await CandidateMapper.create({
      election_id: electionId,
      name: candidate.name,
    });
    return condidateModelT;
  });

  return condidateModel;
};

// 结束选举
const end = async (electionId) => {
  const election = await electionRepository.getElection(electionId);
  if (election.get('stat') !== 2) {
    throw new BussErr(`选举 ${electionId} 不在进行中状态`);
  }

  election.stat = 3;
  await election.save();
};

// 开始选举
const start = async (electionId) => {
  const election = await electionRepository.getElection(electionId);
  if (election.get('stat') !== 1) {
    throw new BussErr(`选举 ${electionId} 不是初始化状态。`);
  }

  // 查询选举人数
  const count = await CandidateMapper.count({
    where: {
      election_id: electionId,
    },
  });

  if (count < 2) {
    throw new BussErr(`选举 ${electionId} 需要 2 个人以上才能开始。`);
  }

  election.set('stat', 2);
  await election.save();
  return election;
};

// 校验
const validElector = async (electionId, electorId) => {
  // 校验选举状态
  const election = await electionRepository.getElection(electionId);
  if (election.get('stat') !== 2) {
    throw new BussErr(`选举 ${election} 不在投票中。`);
  }

  // 判断是否参与过选举
  const count = electionRepository.countVote(electionId, electorId);
  if (count) {
    throw new BussErr('您已经参与过这场选举了。');
  }
};

// 投票
const voting = async (electionId, electorId, candidateId, email) => {
  // 先校验权限
  await validElector(electionId, electorId);

  // 投票
  const count = await electionRepository.electionHasCandidate(electionId, candidateId);

  if (!count) {
    throw new BussErr('参选人不在这场选举中。');
  }

  const vote = await VoteMapper.create({
    candidate_id: candidateId,
    elector_email: email,
    elector_id: electorId,
  });
  return vote;
};

// 选举详情
const queryElectionDetail = async (electionId) => {
  const election = await electionRepository.getElection(electionId, true);

  const voteDetail = await electionRepository.queryVoteDetailByElectionId(electionId);

  return {
    ...election,
    detail: voteDetail,
  };
};

// 选举人详情
const queryCandidateDetail = async (condidateId, page) => {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const votesResult = await VoteMapper.findAndCountAll({
    where: {
      condidate_id: condidateId,
    },
    limit: pageSize,
    offset,
  });
  return {
    votes: votesResult.rows,
    page,
    votesCount: votesResult.count,
  };
};

module.exports = {
  start,
  create,
  end,
  addCandidate,
  validElector,
  voting,
  queryElectionDetail,
  queryCandidateDetail,
};
