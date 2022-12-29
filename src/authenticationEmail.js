const {LocalStrategy} = require('@feathersjs/authentication-local');
const {NotAcceptable, NotAuthenticated} = require('@feathersjs/errors');
const {customAlphabet} = require('nanoid');
const {sendTokenEmail} = require('./sendAuthNotification');
const customResponse = require('./hooks/customResponse');

class EmailStrategy extends LocalStrategy {
  constructor(app) {
    super();
    this.app = app;
  }

  async authenticate(authentication, params) {
    const {entity} = this.configuration;
    const records = authentication;
    const UserModel = this.app.service('users').getModel().query();

    if (!records.email) throw new NotAcceptable('Debes enviar tu email.');

    const user = await UserModel.whereIn('status', [
      'active',
      'pending validation',
      'pending security verification',
      'pending user data',
    ])
      .where({
        email: records.email,
        // deletedAt: null,
      })
      .then((it) => it[0]);

    if (user && (user.status == 'inactive' || user.deletedAt !== null))
      throw new NotAcceptable('Tu cuenta está suspendida, contacta al administrador.');

    const token = await customAlphabet('123456789', 4)();
    let dataNotification = null;

    if (!user) {
      records.token_login_email = token;
      records.status = 'pending validation';

      records.strategy ? delete records.strategy : null;
      const userCreated = await UserModel.insert(records);

      delete userCreated.token_login_email;

      //enviar correo
      dataNotification = {
        type: 'email',
        user: {...userCreated},
        typeNotification: 'loginEmail',
        token: token,
      };

      await this.app.service('send-notifications').create(dataNotification);

      throw new customResponse(
        'send-token',
        'se envió el token por medio de un email.',
        200,
        'customResponse'
      );
    } else if (user && !records.token_login_email) {
      await UserModel.patch({
        token_login_email: token,
        // status: "pending user data",
      }).where({id: user.id});

      dataNotification = {
        type: 'email',
        user: {...user},
        typeNotification: 'loginEmail',
        token: token,
      };

      await this.app.service('send-notifications').create(dataNotification);

      throw new customResponse(
        'send-token',
        'se envió el token por medio de un email.',
        200,
        'customResponse'
      );
    }

    const currentUser = await this.app.service('users')
      .find({
          query: { email: records.email, token_login_email: records.token_login_email },
          paginate: false
      })
      .then(res => res[0])  

    if (!currentUser) {
      throw new NotAuthenticated('Usuario o contraseña invalidos.');
    }

    delete currentUser.password;

    if (currentUser.status === 'pending validation') {
      await UserModel.patch({ token_login_email: '', status: (currentUser.first_name &&
          currentUser.last_name &&
          currentUser.dni &&
          currentUser.email) ? 'active' : 'pending user data' }).where({id: user.id});
      currentUser.status = (currentUser.first_name &&
        currentUser.last_name &&
        currentUser.dni &&
        currentUser.email) ? 'active' : 'pending user data';
    } else {
      await UserModel.patch({ token_login_email: '' }).where({ id: user.id });
    }

    // aqui vas a probar el token al principio te envian el token_login en null OJO

    return {authentication: {strategy: this.name}, [entity]: currentUser};
  }
}

module.exports = EmailStrategy;
