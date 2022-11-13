const { QueryTypes } = require('sequelize');
const { CandidateMapper } = require('../model/election');
const sequelize = require('../db');

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

module.exports = { countVote, electionHasCandidate };
