const { fastJoin } = require("feathers-hooks-common");

exports.withAllDataJoin = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      [
        record.prices,
        record.customer_groups,
      ] = await Promise.all([
        context.app.service('price-list-prices')
          .getModel()
          .findAll({
            where: { price_list_id: record.id },
            include: ['product']
          }),
        context.app.service('price-list-customer-groups')
          .getModel()
          .findAll({
            where: { price_list_id: record.id },
            include: [{ association: 'customer_group' }]
          })
      ])
    }
  }
})