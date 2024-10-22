module.exports = {
  async sync_code(user, _, { db }) {
    try {
      const syncCode = await db.code.getByFields({
        user_id: user.id,
      })
      return syncCode?.code
    } catch (error) {
      return null
    }
  },
}
