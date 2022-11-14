const { QueryTypes } = require('sequelize');
const { CandidateMapper, ElectionMapper } = require('../model/election');
const sequelize = require('../db');

const { BussErr } = require('../exception');

// 查看用户是否对某个选举投票过
const countVote = async (electionId, electorId) => {
  const results = await sequelize.query('SELECT COUNT(*) as cnt FROM votes JOIN candidates USING(candidate_id) WHERE votes.`elector_id` = ? AND election_id = ?', {
    replacements: [electorId, electionId],
    type: QueryTypes.SELECT,
  });

  return results[0].cnt;
};

// 查看参选人是否在选举中
const electionHasCandidate = async (electionId, candidateId) => {
  const candidateCount = await CandidateMapper.count({
    where: {
      election_id: electionId,
      candidate_id: candidateId,
    },
  });
  return candidateCount;
};

// 根据选举 ID 获取投票详情
const queryVoteDetailByElectionId = async (electionId) => {
  const results = await sequelize.query('SELECT COUNT(vote_id) AS cnt, candidate_id, `name` FROM candidates LEFT JOIN votes USING(candidate_id) WHERE candidates.`election_id` = ? GROUP BY candidate_id', {
    replacements: [electionId],
    type: QueryTypes.SELECT,
  });
  return results;
};

// 遍历选票
const getVotes = async (lastId, electionId, limit) => {
  const cursor = lastId || 0;
  const results = await sequelize.query('SELECT vote_id,elector_email FROM votes JOIN candidates USING(candidate_id) WHERE election_id = ? AND vote_id > ? LIMIT ?', {
    replacements: [electionId, cursor, limit],
    type: QueryTypes.SELECT,
  });
  return results;
};

// 获取选举
async function getElection(electionId, raw = false, lock = false) {
  const options = {};
  if (raw) {
    options.raw = true;
    options.nest = true;
  }

  if (lock) {
    // 添加行级锁，防止并发
    options.lock = true;
  }

  const election = await ElectionMapper.findByPk(electionId, options);
  // 查询选举是否存在
  if (election == null) {
    throw new BussErr(`找不到选举 ${electionId}。`);
  }
  return election;
}

module.exports = {
  countVote, electionHasCandidate, queryVoteDetailByElectionId, getVotes, getElection,
};
