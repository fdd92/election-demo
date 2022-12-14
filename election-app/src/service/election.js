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
  const condidateModel = await sequelize.transaction(async () => {
    // 查询选举是否存在
    const election = await electionRepository.getElection(electionId, false, true);
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
  const electionModel = await sequelize.transaction(async () => {
    const election = await electionRepository.getElection(electionId, false, true);
    if (election.get('stat') !== 2) {
      throw new BussErr(`选举 ${electionId} 不在进行中状态`);
    }

    election.stat = 3;
    await election.save();
    return election;
  });
  return electionModel;
};

// 开始选举
const start = async (electionId) => {
  const electionModel = await sequelize.transaction(async () => {
    const election = await electionRepository.getElection(electionId, false, true);
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
  });
  return electionModel;
};

// 校验
const validElector = async (electionId, electorId) => {
  // 校验选举状态
  const election = await electionRepository.getElection(electionId);
  if (election.get('stat') !== 2) {
    throw new BussErr(`选举 ${election.get('election_id')} 不在投票中。`);
  }

  // 判断是否参与过选举
  const count = await electionRepository.countVote(electionId, electorId);

  if (count) {
    throw new BussErr('您已经参与过这场选举了。');
  }
};

// 投票
const voting = async (electionId, electorId, candidateId, email) => {
  const voteDetail = await sequelize.transaction(async () => {
    // 先校验权限
    await validElector(electionId, electorId);

    // 投票
    const count = await electionRepository.electionHasCandidate(electionId, candidateId);

    if (!count) {
      throw new BussErr('参选人不在这场选举中。');
    }

    await VoteMapper.create({
      candidate_id: candidateId,
      elector_email: email,
      elector_id: electorId,
    });

    const detail = await electionRepository.queryVoteDetailByElectionId(electionId);
    return detail;
  });
  return voteDetail;
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
const queryCandidateDetail = async (candidateId, page) => {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const votesResult = await VoteMapper.findAndCountAll({
    where: {
      candidate_id: candidateId,
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
