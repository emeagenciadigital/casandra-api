const users = require('./users/users.service.js');
const addresses = require('./addresses/addresses.service.js');
const recoveryPassword = require('./recovery-password/recovery-password.service.js');
const sendNotifications = require('./send-notifications/send-notifications.service.js');
const userDeviceTokens = require('./user-device-tokens/user-device-tokens.service.js');
const locationsStates = require('./locations-states/locations-states.service.js');
const currentUser = require('./current-user/current-user.service.js');
const locationsCities = require('./locations-cities/locations-cities.service.js');
const creditCards = require('./credit-cards/credit-cards.service.js');
const categories = require('./categories/categories.service.js');
const brands = require('./brands/brands.service.js');
const taxRule = require('./tax-rule/tax-rule.service.js');
const products = require('./products/products.service.js');
const productsMedia = require('./products-media/products-media.service.js');
const copyTemplateNutritionalTable = require('./copy-template-nutritional-table/copy-template-nutritional-table.service.js');
const shoppingCart = require('./shopping-cart/shopping-cart.service.js');
const shoppingCartDetails = require('./shopping-cart-details/shopping-cart-details.service.js');
const ordersStatus = require('./orders-status/orders-status.service.js');
const orders = require('./orders/orders.service.js');
const orderHistory = require('./order-history/order-history.service.js');
const shipping = require('./shipping/shipping.service.js');
const shippingStatus = require('./shipping-status/shipping-status.service.js');
const shippingDetails = require('./shipping-details/shipping-details.service.js');
const shippingHistory = require('./shipping-history/shipping-history.service.js');
const calculateNextDelivery = require('./calculate-next-delivery/calculate-next-delivery.service.js');
const searchShippingCost = require('./search-shipping-cost/search-shipping-cost.service.js');
const shippingCosts = require('./shipping-costs/shipping-costs.service.js');
const favorites = require('./favorites/favorites.service.js');
const cms = require('./cms/cms.service.js');
const ordersDetails = require('./orders-details/orders-details.service.js');
const configurations = require('./configurations/configurations.service.js');
const fulfillmentCompany = require('./fulfillment-company/fulfillment-company.service.js');
const fulfillmentMatrix = require('./fulfillment-matrix/fulfillment-matrix.service.js');
const fulfillmentCities = require('./fulfillment-cities/fulfillment-cities.service.js');
const fulfillmentCost = require('./fulfillment-cost/fulfillment-cost.service.js');
const enviaColvanes = require('./envia-colvanes/envia-colvanes.service.js');
const contact = require('./contact/contact.service.js');
const documentosPed = require('./documentos-ped/documentos-ped.service.js');
const documentosPedHistoria = require('./documentos-ped-historia/documentos-ped-historia.service.js');
const design = require('./design/design.service.js');
const updateProducts = require('./update-products/update-products.service.js');
const tercerosDms = require('./terceros-dms/terceros-dms.service.js');
const banners = require('./banners/banners.service.js');
const purchaseOrders = require('./purchase-orders/purchase-orders.service.js');
const sitemap = require('./sitemap/sitemap.service.js');
const characteristics = require('./characteristics/characteristics.service.js');
const productsCharacteristics = require('./products-characteristics/products-characteristics.service.js');
const reviews = require('./reviews/reviews.service.js');
const faq = require('./faq/faq.service.js');
const blogs = require('./blogs/blogs.service.js');
const blogsCategories = require('./blogs-categories/blogs-categories.service.js');
const catalogs = require('./catalogs/catalogs.service.js');
const stores = require('./stores/stores.service.js');
const labels = require('./labels/labels.service.js');
const labelsConditions = require('./labels_conditions/labels_conditions.service.js');
const discounts = require('./discounts/discounts.service.js');
const dicountConditions = require('./dicount_conditions/dicount_conditions.service.js');
const paymentConfirmations = require('./payment-confirmations/payment-confirmations.service.js');
const wompiTokenizeCreditCard = require('./wompi-tokenize-credit-card/wompi-tokenize-credit-card.service.js');
const meilisearch = require('./meilisearch/meilisearch.service')
const createProcessPayment = require('./create-process-payment/create-process-payment.service.js');
const wompiGenerateMerchant = require('./wompi-generate-merchant/wompi-generate-merchant.service.js');
const wompiPseBanks = require('./wompi-pse-banks/wompi-pse-banks.service.js');
const wompiWebhookEvents = require('./wompi-webhook-events/wompi-webhook-events.service.js');
const contactsDirectory = require('./contacts-directory/contacts-directory.service')
const contactsDirectoryAttributes = require('./contacts-directory-attributes/contacts-directory-attributes.service')
const contactsDirectoryCategories = require('./contacts-directory-categories/contacts-directory-categories.service')
const contactsDirectoryMedia = require('./contacts-directory-media/contacts-directory-media.service')
const workOffers = require('./work-offers/work-offers.service')
const courses = require('./courses/courses.service')
const coursesCategories = require('./courses-categories/courses-categories.service')
const courseSections = require('./course-sections/course-sections.service')
const courseBenefits = require('./course-benefits/course-benefits.service')
const courseChapters = require('./course-chapters/course-chapters.service')
const courseRating = require('./course-rating/course-rating.service')
const walletMovements = require('./wallet-movements/wallet-movements.service')
const walletBonus = require('./wallet-bonus/wallet-bonus.service')
const workOffersCategories = require('./work-offers-categories/work-offers-categories.service')
const userProductViews = require('./user-product-views/user-product-views.service')
const rawQueries = require('./raw-queries/raw-queries.service')
const wompiVerifiedCreditCard = require('./wompi-verified-credit-card/wompi-verified-credit-card.service')
const userGatewayTransactions = require('./user-gateway-transactions/user-gateway-transactions.service')
const processPaymentResponse = require('./process-payment-response/process-payment-response.service')
const userCourses = require('./user-courses/user-courses.service')
const priceList = require('./price-list/price-list.service')
const priceListPrices = require('./price-list-prices/price-list-prices.service')
const priceListCustomerGroups = require('./price-list-customer-groups/price-list-customer-groups.service')
const customerGroup = require('./customer-group/customer-group.service')
const customerGroupCustomers = require('./customer-group-customers/customer-group-customers.service')

module.exports = function (app) {
  app.configure(users);
  app.configure(addresses);
  app.configure(recoveryPassword);
  app.configure(sendNotifications);
  app.configure(userDeviceTokens);
  app.configure(locationsStates);
  app.configure(currentUser);
  app.configure(locationsCities);
  app.configure(creditCards);
  app.configure(categories);
  app.configure(brands);
  app.configure(taxRule);
  app.configure(products);
  app.configure(productsMedia);
  app.configure(copyTemplateNutritionalTable);
  app.configure(shoppingCart);
  app.configure(shoppingCartDetails);
  app.configure(ordersStatus);
  app.configure(orders);
  app.configure(orderHistory);
  app.configure(shipping);
  app.configure(shippingStatus);
  app.configure(shippingDetails);
  app.configure(shippingHistory);
  app.configure(calculateNextDelivery);
  app.configure(searchShippingCost);
  app.configure(shippingCosts);
  app.configure(favorites);
  app.configure(cms);
  app.configure(ordersDetails);
  app.configure(configurations);
  app.configure(fulfillmentCompany);
  app.configure(fulfillmentMatrix);
  app.configure(fulfillmentCities);
  app.configure(fulfillmentCost);
  app.configure(enviaColvanes);
  app.configure(contact);
  app.configure(documentosPed);
  app.configure(documentosPedHistoria);
  app.configure(design);
  app.configure(updateProducts);
  app.configure(tercerosDms);
  app.configure(banners);
  app.configure(purchaseOrders);
  app.configure(sitemap);
  app.configure(characteristics);
  app.configure(productsCharacteristics);
  app.configure(reviews);
  app.configure(faq);
  app.configure(blogs);
  app.configure(blogsCategories);
  app.configure(catalogs);
  app.configure(stores);
  app.configure(labels);
  app.configure(labelsConditions);
  app.configure(discounts);
  app.configure(dicountConditions);
  app.configure(paymentConfirmations);
  app.configure(wompiTokenizeCreditCard);
  app.configure(createProcessPayment);
  app.configure(wompiGenerateMerchant);
  app.configure(wompiPseBanks);
  app.configure(wompiWebhookEvents);
  app.configure(meilisearch);
  app.configure(contactsDirectory);
  app.configure(contactsDirectoryAttributes);
  app.configure(contactsDirectoryCategories);
  app.configure(contactsDirectoryMedia);
  app.configure(workOffers);
  app.configure(courses);
  app.configure(coursesCategories);
  app.configure(courseSections);
  app.configure(courseBenefits);
  app.configure(courseChapters);
  app.configure(courseRating);
  app.configure(walletMovements);
  app.configure(walletBonus);
  app.configure(workOffersCategories);
  app.configure(userProductViews);
  app.configure(rawQueries);
  app.configure(wompiVerifiedCreditCard);
  app.configure(userGatewayTransactions);
  app.configure(processPaymentResponse);
  app.configure(userCourses);
  app.configure(priceList);
  app.configure(priceListPrices);
  app.configure(priceListCustomerGroups);
  app.configure(customerGroup);
  app.configure(customerGroupCustomers);
};
