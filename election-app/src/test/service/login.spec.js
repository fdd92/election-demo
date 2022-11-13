const console = require('console');
const { login } = require('../../service/admin');

test('正常登录', async () => {
  const token = await login('admin', 'Aa123456');
  console.log('token', token);
  expect(token).not.toBeNull();
});

test('账号错误', async () => {
  expect(login('admin1', 'Aa123456')).resolves.toThrow('账号或密码错误。');
});

test('密码错误', async () => {
  expect(login('admin', 'Aa12345')).resolves.toThrow('账号或密码错误。');
});
