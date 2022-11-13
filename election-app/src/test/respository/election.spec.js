const electionRepository = require('../../repository/election');
const { CandidateMapper, VoteMapper } = require('../../model/election');

describe('选举 respository', () => {
  const electionId = 2147483647;
  const electorId = 'A123456(1)';

  let candidate;
  let vote;

  beforeAll(async () => {
    // 初始化数据
    candidate = await CandidateMapper.create({
      election_id: electionId,
      name: '测试',
    });

    vote = await VoteMapper.create({
      candidate_id: candidate.get('candidate_id'),
      elector_email: 'test@qq.com',
      elector_id: electorId,
    });
  });

  afterAll(() => {
    // 清除数据
    if (vote !== null) {
      vote.destroy();
    }
    if (candidate !== null) {
      candidate.destroy();
    }
  });

  it('查询选民是否参与过某场选举', async () => {
    await expect(electionRepository.countVote(electionId, electorId)).resolves.toBe(1);
  });
});
