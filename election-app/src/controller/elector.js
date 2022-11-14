const electionService = require('../service/election');

// 校验投票人信息
const validElector = async (req, res) => {
  const { electionId, electorId } = req.body;

  await electionService.validElector(electionId, electorId);

  res.status('200').json({});
};

// 投票
const voting = async (req, res) => {
  const {
    electionId, electorId, email, candidateId,
  } = req.body;

  const detail = await electionService.voting(electionId, electorId, candidateId, email);

  res.status('200').json({ detail });
};

module.exports = { validElector, voting };
