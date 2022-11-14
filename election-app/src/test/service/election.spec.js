const electionService = require('../../service/election');

describe('选举创建与选举人添加', () => {
  it('创建选举', async () => {
    const election = await electionService.create();
    expect(election).not.toBeNull();

    // 清除测试数据
    election.destroy();
  });

  it('添加选举人', async () => {
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

  it('查询不到的选举', async () => {
    expect(electionService.addCandidate(2147483647, {
      name: 'somebody',
    })).rejects.toThrow();
  });

  it('重复添加选举人', async () => {
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
});

describe('开启与结束选举', () => {
  it('开启与结束选举', async () => {
    const election = await electionService.create();

    // 没有选举人情况下开启选举
    await expect(electionService.start(election.election_id)).rejects.toThrow(/选举 \d+ 需要 2 个人以上才能开始。/);

    const candidate1 = await electionService.addCandidate(election.election_id, {
      name: '第一人',
    });

    // 一个选举人情况下开启选举
    await expect(electionService.start(election.election_id)).rejects.toThrow(/选举 \d+ 需要 2 个人以上才能开始。/);
    const candidate2 = await electionService.addCandidate(election.election_id, {
      name: '第二人',
    });

    // 两个选举人情况下开启选举
    await expect(electionService.start(election.election_id)).resolves.not.toThrow();
    await election.reload();

    // 状态修改成已开启
    expect(election.get('stat')).toBe(2);

    // 重复开启选举
    await expect(electionService.start(election.election_id)).rejects.toThrow(/选举 \d+ 不是初始化状态。/);

    // 结束选举
    await expect(electionService.end(election.election_id)).resolves.not.toThrow();

    await election.reload();

    // 状态修改成已结束
    expect(election.get('stat')).toBe(3);

    // 清除测试数据
    election.destroy();
    candidate1.destroy();
    candidate2.destroy();
  });

  it('错误结束选举', async () => {
    const election = await electionService.create();
    await expect(electionService.end(election.election_id)).rejects.toThrow(/选举 \d+ 不在进行中状态/);

    // 清除测试数据
    election.destroy();
  });
});

describe('查询选举详情', () => {
  it('查询选举详情', async () => {
    const electionDetail = await electionService.queryElectionDetail(151);
    console.log(JSON.stringify(electionDetail));
  });
});
