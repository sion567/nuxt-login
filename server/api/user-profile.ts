export default defineEventHandler(async (event) => {
  // 场景：在获取用户信息的同时，需要调用另一个内部 API 获取权限数据
  const permissions = await $api(event, '/api/auth/permissions', {
    method: 'GET'
  });

  return {
    user: 'John Doe',
    permissions
  };
});