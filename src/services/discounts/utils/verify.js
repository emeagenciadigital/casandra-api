const moment = require('moment');
const numeral = require('numeral');
const { NotAcceptable } = require('@feathersjs/errors');

module.exports = async (discount, user, shopping_cart_id, context) => {

		const knex = context.app.get('knex');

		const [totalUserUses, totalOrder] = await Promise.all([
			context.app.service('orders').getModel()
				.query()
				.count('*', { as: 'total_uses' })
				.where({
					user_id: user.id,
					discount_id: discount.id
				}).then(it => it[0].total_uses),
			knex.raw(`
				select sum(
            if(
                p.discount_price_whit_tax is null or p.discount_price_whit_tax = 0,
                if (
                    p.discount_price is null or p.discount_price = 0,
                    if (
                        p.price_with_tax is null or p.price_with_tax = 0,
                        p.price,
                        p.price_with_tax
                    ),
                    p.discount_price
                ),
                p.discount_price_whit_tax
            )
           * scd.quantity) as total
				from shopping_cart_details as scd
				inner join products as p on p.id = scd.product_id
				where scd.shopping_cart_id = ${shopping_cart_id} and scd.deletedAt is null;`)
				.then(it => it[0][0].total)
		])

	// Validar que el código de descuento esté vigente
	const dateStart = moment(moment(discount.date_start).format('YYYY-MM-DD'))
	const dateEnd = moment(moment(discount.date_end).format('YYYY-MM-DD'))
	const now = moment()
	
	if (dateStart > now || now > dateEnd || discount.status === 'inactive')
		throw new NotAcceptable('El código no se encuentra disponible o ya expiró.')

	// Validar que hayan existencias
	if (!discount.quantity) throw new NotAcceptable('Código de descuento agotado.')

	// Validar usos por usuario
	if (totalUserUses + 1 > discount.uses_by_user) throw new NotAcceptable('Has superado el limite de usos para este código.')

	// Validar compra mínima
	if (totalOrder < discount.order_min_amount) throw new NotAcceptable(`Se require una compra mínima de ${numeral(discount.order_min_amount).format('$ 0,0')}`)


	console.log(1, totalOrder)
	const totalDiscount = discount.value_percentage
		? totalOrder * (discount.value_percentage / 100)
		: discount.value_amount || 0

	return totalDiscount;

}