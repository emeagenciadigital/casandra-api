const { QueryTypes } = require('sequelize')
const moment = require('moment')

module.exports = () => async (context) => {
  const query = context.params.query || {}
  const user = context.params.user

  const now = moment().utcOffset(-5).format('YYYY-MM-DD H:mm:ss')

  if (!user || user?.role === 'user') {
    const stmt = context.app.get('sequelizeClient')
    const ids = await stmt.query(`
    select id
    from banners
    where status = 'active'
      and deletedAt is null
      and if(type = 'FLASH_SALE', '${now}' between start_date and end_date, true)
    `, { type: QueryTypes.SELECT })
      .then(res => res.map(it => it.id))
    query.id = { $in: ids }
  }

  context.params.query = query


  return context
}