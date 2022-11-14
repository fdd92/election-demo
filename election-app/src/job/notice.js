const console = require('console');
const { sendMail } = require('../mail');
const { client } = require('../cache');
const electionService = require('../service/election');
const electionRepository = require('../repository/election');

const JOB_STATUS_INIT = 1;
const JOB_STATUS_READY = 2;
const JOB_STATUS_COMPLETED = 3;

// 发送邮件
const sendElectionResult = async (eventMsg) => {
  // 校验消息
  const { electionId } = eventMsg;
  if (!electionId) {
    console.error('消息体错误，收到的消息体：', JSON.stringify(eventMsg));
    return;
  }

  // 获取结果
  const electionDetail = await electionService.queryElectionDetail(electionId);
  console.log(JSON.stringify(electionDetail));
  if (electionDetail.stat !== 3) {
    console.error(`选举 ${electionId} 还未结束`);
    return;
  }

  // 邮件任务开始执行，保证幂等
  const taskCacheKey = `task:sendElectionResult:${electionId}`;
  const cacheResult = await client.set(taskCacheKey, JOB_STATUS_INIT, {
    EX: 60 * 60 * 24, // 保存一天时间
    NX: true,
  });
  if (!cacheResult) {
    console.error(`选举 ${electionId} 消息已经或者正在发送`);
    return;
  }
  console.log(`选举 ${electionId} 结果发送任务开始`);

  // 加载邮箱
  let lastId;
  let resultLength = 0;
  const limit = 100;
  const cachePromiseList = [];
  const emailCasheKey = `task:sendElectionResult:${electionId}:emails`;

  do {
    /* eslint-disable no-await-in-loop */
    const results = await electionRepository.getVotes(lastId, electionId, limit);
    /* eslint-enable no-await-in-loop */

    resultLength = results.length;
    if (resultLength === 0) {
      break;
    }

    for (let i = 0; i < resultLength; i += 1) {
      const res = results[i];
      const email = res.elector_email;

      // 添加到 redis 集合去重
      cachePromiseList.push(client.sAdd(emailCasheKey, email));

      lastId = res.electionId;
    }
  } while (resultLength === limit);
  // 保证 redis 添加完毕
  await Promise.all(cachePromiseList);

  // 标记任务数据已准备好
  await client.set(taskCacheKey, JOB_STATUS_READY);

  // 准备正文
  let context = '';
  const { detail } = electionDetail;
  for (let i = 0; i < detail.length; i += 1) {
    context += `<tr><td>${detail[i].name}</td><td>${detail[i].cnt}</td></tr>`;
  }

  const html = `<h1>选举结果</h1><table><tr><th>姓名</th><th>票数</th></tr>${context}</table>`;

  let emails = [];

  const sendEmailPromiseList = [];
  do {
    /* eslint-disable no-await-in-loop */
    emails = await client.sPop(emailCasheKey, 10);
    /* eslint-enable no-await-in-loop */
    if (emails.length === 0) {
      break;
    }

    const toEmail = emails.join(';');
    const sendMailPromise = sendMail(`${toEmail};`, '您参与投票的选举结果', html)
      .catch((err) => {
        console.log('邮件发送失败：', err);
      });
    sendEmailPromiseList.push(sendMailPromise);
  } while (emails.length);

  // 保证邮件发送完毕
  await Promise.all(sendEmailPromiseList);

  // 标记任务数据已准备好
  await client.set(taskCacheKey, JOB_STATUS_COMPLETED);

  console.log(`选举 ${electionId} 结果发送任务结束`);
};

module.exports = {
  sendElectionResult,
};
