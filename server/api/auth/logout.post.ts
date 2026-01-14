export default defineEventHandler(async (event) => {
  // 可以在这里添加额外的逻辑，比如记录日志
  // const session = await getUserSession(event)
  // await db.logs.create({ user: session.user.id, action: 'logout' })

  // 清除 Session
  await clearUserSession(event)

  return { success: true }
})