const userBalanceService = require('./user-balance/user-balance.service')

function upServices(app) {
  app.configure(userBalanceService)
}

module.exports = upServices