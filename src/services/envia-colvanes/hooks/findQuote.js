// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const axios = require("axios");
const { getItems, replaceItems } = require("feathers-hooks-common");
const { runInContext } = require("lodash");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let result = {};

    if (records.action == "find") {
      const COD_FORMA_PAGO_CREDITO = 4;
      const COD_CUENTA = 498;
      const COD_OFICINA_CTA = 1;
      const COD_REGIONAL_CTA = 4;
      await axios
        .post(
          "http://200.69.100.66/ServicioLiquidacionREST/Service1.svc/Liquidacion/",
          {
            ciudad_origen: records.city_origin,
            ciudad_destino: records.destination_city,
            cod_formapago: COD_FORMA_PAGO_CREDITO,
            cod_servicio: records.service_code,
            num_unidades: records.number_of_units,
            mpesoreal_k: Math.round(records.weight),
            mpesovolumen_k: Math.round(records.volume),
            valor_declarado: Math.round(records.declared_value),
            Cod_Regional_Cta: COD_REGIONAL_CTA,
            Cod_Oficina_Cta: COD_OFICINA_CTA,
            Cod_Cuenta: COD_CUENTA,
            mca_docinternacional: 0,
            con_cartaporte: "0",
            info_contenido: {
              num_documentos: "12345-67890",
            },
          }
        )
        .then(function (response) {
          result = {
            ...response.data,
            status: "success",
            service_code: records.service_code,
            send_description: records.sendDescription,
          };
        })
        .catch(function (error) {
          result = {
            ...error.response.data,
            status: "failed",
            service_code: records.service_code,
            send_description: records.sendDescription,
          };
        });

      context.result = result;
    }
    replaceItems(context, records);

    return context;
  };
};
