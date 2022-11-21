const { fastJoin } = require("feathers-hooks-common");

exports.withWorkOfferJoin = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      record.work_offer = await context.app.service('work-offers')
        .getModel()
        .findByPk(record.work_offer_id)
    }
  }
})