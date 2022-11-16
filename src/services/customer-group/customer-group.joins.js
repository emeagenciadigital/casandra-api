const { fastJoin } = require('feathers-hooks-common')

exports.withAllDataJoin = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      [
        record.customers,
        record.price_lists
      ] = await Promise.all([
        context.app.service('customer-group-customers')
          .getModel()
          .findAll({
            where: { customer_group_id: record.id },
            include: [{
              association: 'customer',
              attributes: [
                'id',
                'email',
                'first_name',
                'last_name',
                'phone',
                'profile_picture'
              ]
            }]
          }),
        context.app.service('price-list-customer-groups')
          .getModel()
          .findAll({
            where: { customer_group_id: record.id },
            include: [{ association: 'price_list', include: ['prices'] }]
          })
      ])
    }
  }
})