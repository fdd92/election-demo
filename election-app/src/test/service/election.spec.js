const { Integer } = require('tcomb');
const electionService = require('../../service/election');

test('创建选举', async () => {
  const election = await electionService.create();
  expect(election).not.toBeNull();

  // 清除测试数据
  election.destroy();
});

test('添加选举人', async () => {
  // 准备选举
  const election = await electionService.create();

  // 创建 1 号选举人
  const candidate1 = await electionService.addCandidate(election.election_id, {
    name: '1号',
  });
  expect(candidate1).not.toBeNull();

  // 创建 2 号选举人
  const candidate2 = await electionService.addCandidate(election.election_id, {
    name: '2号',
  });
  expect(candidate2).not.toBeNull();

  // 清除测试数据
  election.destroy();
  candidate1.destroy();
  candidate2.destroy();
});

test('查询不到的选举', async () => {
  expect(electionService.addCandidate(2147483647, {
    name: 'somebody',
  })).rejects.toThrow();
});

test('重复添加选举人', async () => {
  // 准备选举
  const election = await electionService.create();
  // 创建 3 号选举人
  const candidate3 = await electionService.addCandidate(election.election_id, {
    name: '3号',
  });

  await expect(electionService.addCandidate(election.election_id, {
    name: '3号',
  })).rejects.toThrow();

  // 清除测试数据
  election.destroy();
  candidate3.destroy();
});
