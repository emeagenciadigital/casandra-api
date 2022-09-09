// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const calculateDataFulfillmentCompany = require("../../../hooks/calculateDataFulfillmentCompany");
const calculateVolume = require("../../../hooks/calculate-volume");
const axios = require("axios");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const { shippingDetails, shipping } = context;

    if (records.shipping_status_id == 3) return context;
    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .select(
        "orders.*",
        "companies.name AS name",
        "users.phone AS phone",
        "users.dni",
        "users.email"
      )
      .leftJoin("companies", "companies.id", "=", "orders.company_id")
      .leftJoin("users", "users.id", "=", "orders.user_id")
      .where({ "orders.id": shipping.order_id })
      .then((it) => it[0]);

    const shippingAddress = JSON.parse(order.shipping_address_meta_data);

    for (const shippingDetail of shippingDetails) {
      if (!shippingDetail.weight && records.fulfillment_company_id === 2)
        throw new NotAcceptable(
          `El producto id: ${shippingDetail.product_id} - ${shippingDetail.product_name} no tiene un peso, para poder enviarlo ves a la pagina de edición y agregale un peso.`
        );
    }

    if (records.shipping_status_id == 2 || records.shipping_status_id == 4) {
      if (!records.fulfillment_company_id)
        throw new NotAcceptable("Debes enviar el id de la transportadora.");
      const {
        totalWeight,
        heigh,
        width,
        long,
        declared_value,
      } = await calculateDataFulfillmentCompany({ pack: shippingDetails })(
        context
      );

      const volume = await calculateVolume({ heigh, long, width })(context);
      let fulfillment_company_meta_data = {};
      let price = null;

      if (records.fulfillment_company_id == 1) {
        const fulfillmentMatrix = await context.app
          .service("fulfillment-matrix")
          .getModel()
          .query()
          .select("fulfillment_matrix.*", "locations_cities.name AS city_name")
          .innerJoin(
            "locations_cities",
            "fulfillment_matrix.destination_city_id",
            "=",
            "locations_cities.id"
          )
          .where({
            fulfillment_company_id: records.fulfillment_company_id,
            type: "weight",
          })
          .where("min", "<=", totalWeight)
          .where("max", ">=", totalWeight)
          .where("fulfillment_company_id", records.fulfillment_company_id)
          .then((it) => it[0]);

        if (!fulfillmentMatrix)
          throw new NotAcceptable(
            "No se encontro registro en la matrix de las transportadoras."
          );

        price = fulfillmentMatrix.price;
        fulfillment_company_meta_data = fulfillmentMatrix;
      } else if (records.fulfillment_company_id == 2) {
        //aqui preguntar que si por avion o via terrestre
        //CODIGO DE SERVICIO 3: (Mercancia Terrestre) Si supera los 9 Kg o es más de una unidad de empaque
        //CODIGO DE SERVICIO 2: :(Mercancia Aerea) Si supera los 9 Kg o es más de una unidad de empaque.
        //CODIGO DE SERVICIO 12 :(Paquete Terrestre) Si el peso se encuentra entre 1 y 8 Kg y es una sola unidad de empaque.
        //CODIGO DE SERVICIO 13 :(Paquete Aereo) Si el peso se encuentra entre 1 y 8 Kg y es una sola unidad de empaque
        records.fulfillment_company_service_code_description =
          records.fulfillment_company_service_code;

        if (records.fulfillment_company_service_code == "terrestre") {
          if (totalWeight > 9) {
            records.fulfillment_company_service_code = 3;
          } else if (totalWeight < 9) {
            records.fulfillment_company_service_code = 12;
          }
        } else if (records.fulfillment_company_service_code) {
          if (totalWeight > 9) {
            records.fulfillment_company_service_code = 2;
          } else if (totalWeight < 8) {
            records.fulfillment_company_service_code = 13;
          }
        }

        fulfillment_company_meta_data = await context.app
          .service("envia-colvanes")
          .create({
            code_dane_destination: shippingAddress.dane_code,
            totalWeight: totalWeight,
            volume: Math.round(volume) < 1 ? 1 : Math.round(volume),
            declared_value,
            destination_name: order.name,
            destination_address: shippingAddress.address,
            destination_phone: order.phone,
            action: "create_guide",
            service_code: records.fulfillment_company_service_code,
            payment_method: 4,
            number_of_units: 1,
          });

        if (fulfillment_company_meta_data.respuesta != "")
          throw new NotAcceptable(`${fulfillment_company_meta_data.respuesta}`);

        price =
          fulfillment_company_meta_data.valor_flete +
          fulfillment_company_meta_data.valor_costom;
      } else if (records.fulfillment_company_id == 4) {
        // if (!records.initial_delivery_time || records.finish_delivery_time) throw ne

        const data = {
          order: {
            hub_id: 2360, //preguntar por esto
            zone: "tvc799", //preguntar por esto
            initial_delivery_time: records.initial_delivery_time,
            finish_delivery_time: records.finish_delivery_time,
            start_time: records.start_time,
            end_time: records.end_time,
            latitude: shippingAddress.lat,
            longitude: shippingAddress.lng,
            neighborhood: shippingAddress.neighborhood
              ? shippingAddress.neighborhood
              : "Sin definir",
            city: shippingAddress.city_name,
            state: shippingAddress.state_name,
            order_number: `Estrategia web - ${shipping.id}`,
            promise: "7-13",
            observations: shippingAddress.notes
              ? shippingAddress.notes
              : "Sin observaciones",
            customer: {
              name: order.name,
              identification_number: order.dni,
              contact: order.name,
              phone: order.phone,
              email: order.email,
              address: shippingAddress.address,
              extra_address: shippingAddress.address,
              internal_id: `${order.id}`, // REVISAR ESTO
            },
            items: shippingDetails.map((it) => ({
              sku: it.code,
              barcode: ``,
              description: it.product_name,
              unit_weight: it.width,
              unit_volume:
                (it.width / 100) * (it.long / 100) * (it.heigh / 100),
              quantity: it.quantity,
              unit_price: it.price,
              total_price: it.price * it.quantity,
              total_collect: it.price * it.quantity,
            })),
          },
        };

        fulfillment_company_meta_data = await context.app
          .service("liftit")
          .create({ ...data });

        fulfillment_company_meta_data = {
          ...fulfillment_company_meta_data,
          guia: fulfillment_company_meta_data.tracking_number,
          urlguia: fulfillment_company_meta_data.tracking_number,
          ...records,
        };

        records.fulfillment_company_service_code_description = "Terrestre";

        delete records.initial_delivery_time;
        delete records.finish_delivery_time;
        delete records.start_time;
        delete records.end_time;
      }

      records.delivery_number = `${fulfillment_company_meta_data.guia}`;
      records.fulfillment_company_delivery_guide =
        fulfillment_company_meta_data.urlguia;
      records.price = price;
      records.fulfillment_company_meta_data = JSON.stringify(
        fulfillment_company_meta_data
      );
    }

    replaceItems(context, records);

    return context;
  };
};
