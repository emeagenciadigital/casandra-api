const { LocalStrategy } = require("@feathersjs/authentication-local");
const { NotAcceptable, NotAuthenticated } = require("@feathersjs/errors");
const { customAlphabet } = require("nanoid");
const { Container } = require("winston");
const customResponse = require("./hooks/customResponse");

class SmsStrategy extends LocalStrategy {
  constructor(app) {
    super();
    this.app = app;
  }

  async authenticate(authentication, params) {
    const { entity } = this.configuration;
    const records = authentication;
    const UserModel = this.app.service("users").getModel().query();

    if (!records.phone)
      throw new NotAcceptable("Debes enviar tu numero de telefono.");

    if (!records.phone_country_code)
      throw new NotAcceptable("Debes enviar el codigo del pais.");

    const user = await UserModel.whereIn("status", [
      "active",
      "pending validation",
      "pending security verification",
      "pending user data",
    ])
      .where({
        phone: records.phone,
        phone_country_code: records.phone_country_code,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (user && user.status == "inactive")
      throw new NotAcceptable("No te encuentras activo.");

    const token = await customAlphabet("123456789", 4)();
    let dataNotification = null;

    if (!user) {
      records.token_login_phone = token;
      records.status = "pending validation";

      records.strategy ? delete records.strategy : null;
      const userCreated = await UserModel.insert(records);

      delete userCreated.token_login_phone;

      dataNotification = {
        type: "sms",
        user: { ...userCreated },
        typeNotification: "loginSms",
        token: token,
      };

      await this.app.service("send-notifications").create(dataNotification);
      //enviar correo
      throw new customResponse(
        "send-token",
        "se envió el token por medio de un mensaje de texto.",
        200,
        "customResponse"
      );
    } else if (user && !records.token_login_phone) {
      await UserModel.patch({
        token_login_phone: token,
        // status: "pending user data",
      }).where({ id: user.id });

      dataNotification = {
        type: "sms",
        user: { ...user },
        typeNotification: "loginSms",
        token: token,
      };

      await this.app.service("send-notifications").create(dataNotification);

      //enviar correo
      throw new customResponse(
        "send-token",
        "se envió el token por medio de un mensaje de texto.",
        200,
        "customResponse"
      );
    }

    const currentUser = await this.app
      .service("users")
      .find({
        query: {
          phone: records.phone,
          token_login_phone: records.token_login_phone,
          phone_country_code: records.phone_country_code,
        },
        paginate: false
      })
      .then((it) => it[0]);

    if (!currentUser)
      throw new NotAuthenticated("Usuario o contraseña invalidos.");

    delete currentUser.password;

    if (user.status == "pending validation")
      await UserModel.patch({
        token_login_phone: "",
        status: "pending user data",
      }).where({ id: user.id });
    else
      await UserModel.patch({
        token_login_phone: "",
      }).where({ id: user.id });

    //aqui vas a probar el token al principio te envian el token_login en null OJO

    return { authentication: { strategy: this.name }, [entity]: currentUser };
  }
}

module.exports = SmsStrategy;
