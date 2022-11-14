const notice = require('../../job/notice');
const { ElectionMapper, CandidateMapper, VoteMapper } = require('../../model/election');

it('测试', async () => {
  // 准备数据
  const election = await ElectionMapper.create({
    stat: 3,
  });
  const electionId = election.get('election_id');

  const candidate1 = await CandidateMapper.create({
    election_id: electionId,
    name: '第一人',
  });
  const candidate2 = await CandidateMapper.create({
    election_id: electionId,
    name: '第二人',
  });
  const candidate3 = await CandidateMapper.create({
    election_id: electionId,
    name: '第三人',
  });

  const vote1 = await VoteMapper.create({
    candidate_id: candidate1.get('candidate_id'),
    elector_email: 'fdd93@qq.com',
    elector_id: 'test',
  });

  const vote2 = await VoteMapper.create({
    candidate_id: candidate2.get('candidate_id'),
    elector_email: 'haia25675@gmail.com',
    elector_id: 'test',
  });

  const vote3 = await VoteMapper.create({
    candidate_id: candidate3.get('candidate_id'),
    elector_email: 'fdd93@qq.com',
    elector_id: 'test',
  });

  const vote4 = await VoteMapper.create({
    candidate_id: candidate3.get('candidate_id'),
    elector_email: 'fdd92@hotmail.com',
    elector_id: 'test',
  });

  // todo mock
  // await notice.sendElectionResult({
  //  electionId,
  // });

  // 清除数据
  election.destroy();
  candidate1.destroy();
  candidate2.destroy();
  candidate3.destroy();
  vote1.destroy();
  vote2.destroy();
  vote3.destroy();
  vote4.destroy();
});
