const notice = require('../../job/notice');
const { client } = require('../../cache');
const electionService = require('../../service/election');
const electionRepository = require('../../repository/election');

jest.mock('../../cache');
jest.mock('../../service/election');
jest.mock('../../repository/election');

const mockSendMail = jest.fn();
mockSendMail.mockReturnValue(Promise.resolve(() => 1));
jest.mock('../../mail', () => ({
  sendMail: () => mockSendMail(),
}));

describe('选举结束，投票结果邮件发送', () => {
  it('测试结果成功发放', async () => {
    // mock
    const election = {
      election_id: 1,
      stat: 3,
      detail: [
        { cnt: 1, candidate_id: 1, name: '测试1' },
        { cnt: 5, candidate_id: 2, name: '测试2' },
        { cnt: 8, candidate_id: 3, name: '测试3' },
      ],
    };
    electionService.queryElectionDetail.mockResolvedValue(election);
    client.set.mockResolvedValue(1);
    client.sAdd.mockResolvedValue(1);
    client.sPop.mockResolvedValue(['fdd92@qq.com', 'fdd93@qq.com']);

    const votes = [
      { vote_id: 1, elector_email: 'fdd92@qq.com' },
      { vote_id: 2, elector_email: 'fdd93@qq.com' },
      { vote_id: 3, elector_email: 'fdd93@qq.com' },
    ];
    electionRepository.getVotes.mockResolvedValue(votes);

    await expect(notice.sendElectionResult({
      electionId: 1,
    })).resolves.not.toThrow();

    // sendMail 方法需要被调用
    expect(mockSendMail).toHaveBeenCalled();
  });
});
