// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.query.facebookId) {
      // context.params.query['email'] =
      //Estas aqui
    }

    return context;
  };
};
