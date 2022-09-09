const { GeneralError, NotAcceptable } = require("@feathersjs/errors");
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const axios = require("axios");
const { getItems, replaceItems } = require("feathers-hooks-common");
const { error } = require("winston");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;


    const COD_CUENTA = 30;
    const COD_OFICINA_CTA = 1;
    const COD_REGIONAL_CTA = 1;
    const AUTHORIZATION = "M0E5MFZJTEw6QzZEOEY2NEY=";
    if (records.action == "create_guide") {
      const data = {
        ciudad_origen: "08001",
        ciudad_destino: `${records.code_dane_destination}`,
        cod_formapago: records.payment_method,
        cod_servicio: records.service_code,
        num_unidades: records.number_of_units,
        mpesoreal_k: records.totalWeight,
        mpesovolumen_k: records.volume,
        valor_declarado: records.declared_value,
        mca_nosabado: 0,
        mca_docinternacional: 0,
        cod_regional_cta: COD_REGIONAL_CTA,
        cod_oficina_cta: COD_OFICINA_CTA,
        cod_cuenta: COD_CUENTA,
        con_cartaporte: "0",
        generar_os: "S",
        info_origen: {
          nom_remitente: "ESTRATEGIA LTDA",
          dir_remitente: "CALLE 13 84 60",
          tel_remitente: "2020202",
          ced_remitente: "79123456",
        },
        info_destino: {
          nom_destinatario: `${records.destination_name}`,
          dir_destinatario: `${records.destination_address}`,
          tel_destinatario: `${records.destination_phone}`,
          ced_destinatario: "",
        },
        info_contenido: {
          dice_contener: "Productos de hogar e industriales",
          texto_guia: "",
          accion_notaguia: "",
          num_documentos: "12345-67890",
          centrocosto: "",
        },
        numero_guia: "",
      };

      let result = [];
      await axios
        .post(
          "http://200.69.100.66/ServicioLiquidacionREST/Service1.svc/Generacion/",
          data,
          {
            headers: {
              Authorization: `Basic ${AUTHORIZATION}`,
            },
          }
        )
        .then(function (response) {
          result = { ...response.data, status: "success" };
        })
        .catch(function (error) {
          result = { ...error.response.data, status: "failed" };
          throw new NotAcceptable(`${error.response.data.respuesta}`);
        });

      context.result = result;
    }

    replaceItems(context, records);

    return context;
  };
};
