const electionService = require('../service/election');

// 校验投票人信息
const validElector = async (req, res) => {
  const { election_id: electionId, elector_id: electorId } = req.body;

  electionService.validElector(electionId, electorId);

  res.status('200').json({});
};

// 投票
const voting = async (req, res) => {
  const {
    election_id: electionId, elector_id: electorId, email, candidate_id: candidateId,
  } = req.body;

  electionService.voting(electionId, electorId, candidateId, email);

  res.status('200').json({});
};

module.exports = { validElector, voting };
