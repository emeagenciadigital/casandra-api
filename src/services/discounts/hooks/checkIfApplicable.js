const { NotAcceptable, NotFound } = require('@feathersjs/errors')
const verify = require('../utils/verify');



module.exports = () => async context => {
	const { params: { shopping_cart_id, checkIfApplicable, user }, result: { data } } = context;
	if (checkIfApplicable !== 'true') return context;
	if (isNaN(shopping_cart_id)) throw new NotAcceptable()
	if (!data.length) throw new NotFound('Código de descuento incorrecto')

	const discount = data[0]
	const totalDiscount = await verify(discount, user, shopping_cart_id, context);
	
	context.result['total_discount_order'] = totalDiscount

	return context;
}