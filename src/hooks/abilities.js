const { AbilityBuilder, Ability } = require('@casl/ability');
const { toMongoQuery } = require('@casl/mongoose');
const { Forbidden } = require('@feathersjs/errors');
const TYPE_KEY = Symbol.for('type');

Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('delete', 'remove');

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject[TYPE_KEY];
}

function defineAbilitiesFor(user, context) {
  const { rules, can, cannot } = AbilityBuilder.extract();

  can('read', ['job-sync-integration-products']);

  if (
    context.service.path === 'authentication' &&
    context.service.data.strategy === 'jwt'
  ) {
    can('read', ['users']);
  }

  can('create', [
    'users',
    'recovery-password',
    'payment-confirmations-epayco',
    'shopping-cart',
    'shopping-cart-details',
    'contact',
    'user-products-views',
    'payment-confirmation-paymentez',
    'wompi-webhook-events',
  ]);

  can('read', [
    'products',
    'categories',
    'brands',
    'locations-states',
    'locations-cities',
    'configurations',
    'cms',
    'design',
    'banners',
    'shopping-cart',
    'blogs',
    'reviews',
    'faq',
    'catalogs',
    'stores',
    'products-characteristics',
    'discounts',
    'contacts-directory'
  ]);

  can('update', [
    'recovery-password',
    'shopping-cart-details',
    'shopping-cart',
  ]);
  can('remove', ['shopping-cart-details', 'shopping-cart']);

  if (user) {
    if (user.status === 'active') {
      //hacer acciones
      can('create', [
        'purchase-orders',
        'user-device-tokens',
        'addresses',
        'credit-cards',
        'authors',
        'shopping-cart',
        'shopping-cart-details',
        'orders',
        'process-order-payments',
        'recurring-shopping-cart',
        'recurring-shopping-cart-details',
        'favorites',
        'custom-payments',
        'reviews',

        'create-process-payment',
        'wompi-tokenize-credit-card',
        'wompi-generate-merchant',
        'wompi-pse-banks',
      ]);

      can('read', ['users'], { id: user.id });

      can('read', ['custom-payments', 'purchase-orders'], {
        company_id: user.company_id,
      });
      can('read', ['orders'], {
        user_id: user.id,
      });

      can('read', ['shopping-cart'], {
        company_id: user.company_id,
        user_id: user.id,
      });

      can('update', ['shopping-cart-details', 'shopping-cart']);

      can(
        'manage',
        ['addresses', 'credit-cards', 'favorites', 'companies-files'],
        {
          user_id: user.id,
        }
      );
      can('delete', ['shopping-cart'], { user_id: user.id });

      can('manage', ['shopping-cart-details']);

      can('read', [
        'current-user',
        'credentials',
        'products',
        'categories',
        'blogs',
        'brands',
        'calculate-next-delivery',
        'shipping-cost',
        'cms',
        'fulfillment-cities',
        'configurations',
        'companies-files-list',
        'shipping',
        'shipping-details',
        'catalogs',
      ]);

      can('update', ['users']);

      if (user.owner_company === 'true') {
        can('create', ['companies-files']);

        can('manage', ['companies-files'], {
          company_id: user.company_id,
        });

        can('read', ['orders'], { company_id: user.company_id });

        can('update', ['orders'], { company_id: user.company_id });

        can('remove', ['users'], { company_id: user.company_id });

        can('read', ['companies-files'], {
          company_id: user.company_id,
        });
      }

      if (user.role === 'admin') {
        can('manage', ['all']);
        cannot('remove', ['fulfillment-company']);
      } else if (user.role === 'integration') {
        can('create', [
          'products',
          'integrations-terceros',
          'price-list',
          'product-price-list',
        ]);
        can('manage', ['products', 'addresses', 'product-price-list']);
        can('update', ['orders', 'locations-cities', 'locations-states']);
        can('read', ['orders', 'product-price-list', 'price-list']);
        can('remove', ['integrations-terceros']);
      }
    } else if (
      (user && user.status === 'pending security verification') ||
      user.status === 'pending user data' ||
      user.status === 'pending validation'
    ) {
      can(['read', 'update'], ['users'], { id: user.id });
    } else {
      throw new Forbidden('Tu usuario se encuentra inactivo.');
    }
  } else {
    can('create', ['shopping-cart', 'shopping-cart-details']);

    can('read', ['shopping-cart']);

    can('update', ['shopping-cart-details', 'shopping-cart']);
  }

  if (process.env.NODE_ENV !== 'production') {
    can('create', ['users']);
  }

  return new Ability(rules, { subjectName });
}

function canReadQuery(query) {
  return query !== null;
}

module.exports = function authorize(name = null) {
  return async function (hook) {
    const action = hook.method;
    const service = name ? hook.app.service(name) : hook.service;
    const serviceName = name || hook.path;
    const ability = defineAbilitiesFor(hook.params.user, hook);
    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }
    };

    hook.params.ability = ability;

    if (hook.method === 'create') {
      hook.data[TYPE_KEY] = serviceName;
      throwUnlessCan('create', hook.data);
    }

    if (!hook.id) {
      const query = toMongoQuery(ability, serviceName, action);

      if (canReadQuery(query)) {
        Object.assign(hook.params.query, query);
      } else {
        // The only issue with this is that user will see total amount of records in db
        // for the resources which he shouldn't know.
        // Alternative solution is to assign `__nonExistingField` property to query
        // but then feathers-mongoose will send a query to MongoDB which for sure will return empty result
        // and may be quite slow for big datasets
        hook.params.query.id = 0;
      }

      return hook;
    }

    const params = Object.assign({}, hook.params, { provider: null });
    const result = await service.get(hook.id, params);

    result[TYPE_KEY] = serviceName;
    throwUnlessCan(action, result);

    if (action === 'get') {
      // eslint-disable-next-line require-atomic-updates
      hook.result = result;
    }

    return hook;
  };
};