const { checkContext, getItems } = require("feathers-hooks-common");
const Email = require("../../../utils/email/email");

module.exports = function (options = {}) {
  return async (context) => {
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    const records = getItems(context);

    const { user } = context.params;

    if (records.type !== "email") return context;

    let params = {};

    const emailClass = new Email(context);

    switch (records.typeNotification) {
      case "loginEmail":
        params = { otp: records.token };

        emailClass
          .sendAll(
            records.user.email,
            "d-151dd1a47ffb4dd6a069ded282984408",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;

      case "userPendingSegurityVerification":
        params = {
          name: `${records.user.first_name} ${records.user.last_name}`,
        };

        emailClass
          .sendAll(
            records.user.email,
            "d-1cd76114473349c391524058f028078c",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;

      case "userPendingSegurityVerificationAdmin":
        params = {
          name: `${records.user.first_name} ${records.user.last_name}`,
          email: `${records.user.email}`,
        };

        emailClass
          .sendAll(
            "servicliente@estrategias-ltda.com",
            "d-268293fd61dd40cf9351357670d98be3",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;
      case "userActive":
        params = {
          name: `${records.user.first_name} ${records.user.last_name}`,
        };

        emailClass
          .sendAll(
            records.user.email,
            "d-caf23b12f1f6462a9b953531982debfd",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;

      case "orderPendingShipping":
        params = {
          order: `${records.order.order_id}`,
        };

        emailClass
          .sendAll(
            "servicliente@estrategias-ltda.com",
            "d-f010dac625174d70a4dcdfd2283a4870",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;

      default:
        break;

      case "purchaseOrderCreated":
        params = {
          purchase_order: `${records.order}`,
        };

        emailClass
          .sendAll(
            "servicliente@estrategias-ltda.com",
            "d-80f1f9592dfa47d1bbb6953daba2ed4e",
            params
          )
          .then((it) => console.log(it, "enviado"));

        break;
    }
    return context;
  };
};

function error(msg) {
  throw new Error(msg);
}
