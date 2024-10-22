require('dotenv').config(); //require .env for stripe configurations
const moment = require('moment');
const stripe = require('./StripeApi'); //this is Payment Service
const paypal = require('./PaypalApi');
const db = require('../models');
const userModel = db.user;
const stripeSubscriptionsModel = db.stripe_subscriptions;
const stripeSubscriptionsLogModel = db.stripe_subscriptions_log;
const stripePlansModel = db.stripe_plans;
const stripeProductsModel = db.stripe_products;
const stripeServicesModel = db.stripe_services;
const stripeCardsModel = db.stripe_cards;

module.exports = new Service();
function Service() {
  this.userId = 0;
  this.roleId = 0;
  this.currency = process.env.STRIPE_CURRENCY;
  this.prorate = process.env.STRIPE_PRORATE;
  this.forceCancel = process.env.STRIPE_FORCE_CANCEL;

  this.setUserId = function (userId) {
    this.userId = userId;
  };
  this.setRoleId = function (roleId) {
    this.roleId = roleId;
  };
  this.setCurrency = function (currency) {
    this.currency = currency;
  };
  this.setProrationType = function (prorate) {
    this.prorate = prorate;
  };
  this.setCancelType = function (forceCancel) {
    this.forceCancel = forceCancel;
  };
  let convertToCents = function (amount) {
    return amount * 100;
  };
  let handleDBError = function (error) {
    console.error(error);
    throw new Error('Internal error: Database error');
  };
  let handleRequestError = function (error) {
    console.error(error);
    throw new Error('Internal error: Request error');
  };

  this.subscribe = async function (subscriptionParams, plan) {
    var subscription = await stripe.createSubscription(subscriptionParams);
    //create model entry
    let subscriptionModelEntry = {
      stripe_id: subscription.id ?? '',
      cancel_at_period_end: subscription.cancel_at_period_end ?? null,
      current_period_start: moment(new Date(subscription.current_period_start * 1000)).format('YYYY-MM-DD') ?? null,
      current_period_end: moment(new Date(subscription.current_period_end * 1000)).format('YYYY-MM-DD') ?? null,
      user_id: this.userId ?? null,
      role_id: this.roleId ?? null,
      plan_id: plan?.id ?? null,
      coupon_stripe_id: subscription.discount?.coupon?.id ?? '',
      customer_stripe_id: subscription.customer ?? '',
      collection_method: subscription.collection_method ?? '',
      interval: stripeSubscriptionsModel.inverse_interval_mapping(subscription.plan?.interval) ?? 0,
      interval_count: subscription.plan?.interval_count ?? '',
      trial_period_days: subscription.plan?.trial_period_days ?? 0,
      trial_end: subscription.trial_end ? moment(new Date(subscription.trial_end * 1000)).format('YYYY-MM-DD') : null,
      trial_start: subscription.trial_start ? moment(new Date(subscription.subscriptiontrial_start * 1000)).format('YYYY-MM-DD') : null,
      status: stripeSubscriptionsModel.inverse_status_mapping(subscription.status) ?? null,
    };

    let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
    if (!subscriptionCreatedId) {
      throw new Error('Subscription is not found.');
    }

    let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, subscription.status, plan);
    if (!subscriptionLogUpdated) {
      throw new Error('Error while editing subscription log');
    }
    return subscriptionCreatedId;
  };
  this.updateSubscriptionLog = async function (subscriptionCreatedId, subscriptionCreatedStatus, plan) {
    let subscriptionLog = await stripeSubscriptionsLogModel.getLast({ user_id: this.userId, role_id: this.roleId });

    if (!subscriptionLog) {
      let subscriptionLogModelEntry = {
        user_id: this.userId,
        role_id: this.roleId,
        plan_id: plan?.id ?? null,
        subscription_id: subscriptionCreatedId,
        type: plan?.type ?? null,
        status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
      };
      if (!(await stripeSubscriptionsLogModel.insert(subscriptionLogModelEntry))) {
        throw new Error('Subscription log add not successfull');
      }
    } else {
      let subscriptionLogModelEntry = {
        plan_id: plan?.id ?? null,
        subscription_id: subscriptionCreatedId,
        type: plan?.type ?? null,
        status: subscriptionCreatedStatus == 'active' || subscriptionCreatedStatus == 'trialing' ? 1 : 0,
      };

      if (!(await stripeSubscriptionsLogModel.edit(subscriptionLogModelEntry, subscriptionLog.id))) {
        throw new Error('Subscription log edit not successfull');
      }
    }
    return true;
  };
  this.createRegularSubscription = async function (user, plan, card, coupon) {
    let subscriptionParams = {
      customer: user.stripe_id,
      items: [{ price: plan.stripe_id }],
      trial_from_plan: true,
      default_payment_method: card?.stripe_card_id ?? null,
      coupon: coupon?.stripe_id ?? null,
      proration_behavior: this.prorate ? 'create_prorations' : 'none',
    };
    return await this.subscribe(subscriptionParams, plan);
  };
  this.createLifetimeSubscription = async function (user, plan, card, coupon) {
    //create invoice, finalize and pay it.
    let lifetimePlanStripeObject = await stripe.retrievePrice(plan.stripe_id);
    let invoiceItemParams = {
      customer: user.stripe_id,
      price: plan.stripe_id,
      discounts: [{ coupon: coupon?.stripe_id }],
    };
    let invoiceItemCreated = await stripe.createInvoiceItem(invoiceItemParams);

    let invoiceParams = {
      customer: user.stripe_id,
      default_payment_method: card?.stripe_card_id ?? null,
    };
    let invoiceCreated = await stripe.createInvoice(invoiceParams);

    let invoicePaid = await stripe.payInvoice(invoiceCreated.id);

    let subscriptionModelEntry = {
      stripe_id: invoiceItemCreated.id ?? '',
      cancel_at_period_end: null,
      current_period_start: moment().format('YYYY-MM-DD') ?? null,
      current_period_end: null,
      user_id: this.userId ?? null,
      role_id: this.roleId ?? null,
      plan_id: plan?.id ?? null,
      coupon_stripe_id: invoiceItemCreated.discounts.length > 0 ? coupon?.stripe_id : '',
      customer_stripe_id: invoicePaid.customer ?? '',
      collection_method: invoicePaid.collection_method ?? '',
      interval: 4,
      interval_count: null,
      trial_period_days: 0,
      trial_end: null,
      trial_start: null,
      status: 4,
    };

    let subscriptionCreatedId = await stripeSubscriptionsModel.insert(subscriptionModelEntry);
    if (!subscriptionCreatedId) {
      throw new Error('Subscription is not found.');
    }

    let subscriptionLogUpdated = await this.updateSubscriptionLog(subscriptionCreatedId, 'active', plan);
    if (!subscriptionLogUpdated) {
      throw new Error('Error while editing subscription log');
    }

    return subscriptionCreatedId;
  };
  let calculateFullPeriod = function (interval, interval_count = 1) {
    let totalNumberOfDays = stripePlansModel.interval_days_mapping()[interval] * interval_count;
    let cancelAtEpoch = moment().add(totalNumberOfDays, 'days').unix();
    return cancelAtEpoch;
  };
  this.createTrialSubscription = async function (user, plan, card, coupon) {
    let trialPlanFullPeriod = calculateFullPeriod(plan.interval, plan.interval_count);
    let subscriptionParams = {
      customer: user.stripe_id,
      items: [{ price: plan.stripe_id }],
      trial_from_plan: true,
      default_payment_method: card?.stripe_card_id ?? null,
      coupon: coupon?.stripe_id ?? null,
      cancel_at: trialPlanFullPeriod,
      proration_behavior: this.prorate ? 'create_prorations' : 'none',
    };
    return await this.subscribe(subscriptionParams, plan);
  };
  this.updateSubscription = async function (activeSubscription, user, fromPlan, newPlan, card, coupon) {
    let subscriptionStripeId = activeSubscription.stripe_id;

    let fromTrialToRegular = (fromPlan.type == 3 || fromPlan.type == 4) && newPlan.type == 0 ? true : false;
    let fromRegularToTrial = fromPlan.type == 0 && (newPlan.type == 3 || newPlan.type == 4) ? true : false;
    let fromAnyToLifetime = newPlan.type == 1 || newPlan.type == 2 ? true : false;
    let fromLifetimeToAny = fromPlan.type == 1 || fromPlan.type == 2 ? true : false;

    if (fromRegularToTrial || fromTrialToRegular) {
      let subscription = await stripe.retrieveSubscription(subscriptionStripeId);
      let updateParams = {
        default_payment_method: card?.stripe_card_id,
        cancel_at: '',
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPlan.stripe_id,
          },
        ],
        coupon: coupon?.stripe_id ?? null,
        payment_behavior: 'error_if_incomplete',
        // trial_from_plan: true,
      };
      if (fromRegularToTrial) {
        let trialPlanFullPeriod = calculateFullPeriod(newPlan.interval, newPlan.interval_count);
        updateParams.cancel_at = trialPlanFullPeriod;
      }
      let newSubscription = await stripe.updateSubscription({ subscriptionId: subscriptionStripeId, params: updateParams });

      let newSubscriptionModelEntry = {
        cancel_at_period_end: newSubscription.cancel_at_period_end ?? null,
        current_period_start: moment(new Date(newSubscription.current_period_start * 1000)).format('YYYY-MM-DD') ?? null,
        current_period_end: moment(new Date(newSubscription.current_period_end * 1000)).format('YYYY-MM-DD') ?? null,
        plan_id: newPlan?.id ?? null,
        coupon_stripe_id: newSubscription.discount?.coupon?.id ?? '',
        interval: stripeSubscriptionsModel.inverse_interval_mapping(newSubscription.plan?.interval) ?? 0,
        interval_count: newSubscription.plan?.interval_count ?? '',
        trial_period_days: newSubscription.plan?.trial_period_days ?? 0,
        trial_end: newSubscription.trial_end ? moment(new Date(newSubscription.trial_end * 1000)).format('YYYY-MM-DD') : null,
        trial_start: newSubscription.trial_start ? moment(new Date(newSubscription.subscriptiontrial_start * 1000)).format('YYYY-MM-DD') : null,
        status: stripeSubscriptionsModel.inverse_status_mapping(newSubscription.status) ?? null,
      };

      let subscriptionCreatedId = await stripeSubscriptionsModel.edit(newSubscriptionModelEntry, activeSubscription.id);
      if (!subscriptionCreatedId) {
        throw new Error('Subscription is not found.');
      }

      let subscriptionLogUpdated = await this.updateSubscriptionLog(activeSubscription.id, newSubscription.status, newPlan);
      if (!subscriptionLogUpdated) {
        throw new Error('Error while editing subscription log');
      }
      return subscriptionCreatedId;
    } else if (fromAnyToLifetime) {
      await this.cancelRegularSubscription(activeSubscription);
      await this.createLifetimeSubscription(user, newPlan, card, coupon);
    } else if (fromLifetimeToAny) {
      await this.cancelLifetimeSubscription(activeSubscription);
      if (newPlan.type == 0) {
        await this.createRegularSubscription(user, newPlan, card, coupon);
      } else if (newPlan.type == 1 || newPlan.type == 2) {
        await this.createLifetimeSubscription(user, newPlan, card, coupon);
      } else if (newPlan.type == 3 || newPlan.type == 4) {
        await this.createTrialSubscription(user, newPlan, card, coupon);
      }
    }
  };

  this.cancelRegularSubscription = async function (subscription) {
    if (this.forceCancel === 'true') {
      var cancellationParams = {
        subscriptionId: subscription.stripe_id,
        params: {
          invoice_now: true,
          prorate: this.prorate,
        },
      };
      let subscriptionCanceled = await stripe.cancelSubscription(cancellationParams);

      let newStatus = stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status];
      await stripeSubscriptionsModel.edit({ status: newStatus }, subscription.id);

      let subscriptionLog = await stripeSubscriptionsLogModel.getByFields({ subscription_id: parseInt(subscription.id), status: 1 });
      if (!subscriptionLog) {
        throw new Error("Couldn't find relative active subscription log");
      }
      let subscriptionLogEdited = await stripeSubscriptionsLogModel.edit({ status: 0 }, subscriptionLog.id);
      if (!subscriptionLogEdited) {
        throw new Error("Couldn't Edit subscription log");
      }
    } else {
      let updateParams = {
        subscriptionId: subscription.stripe_id,
        params: {
          cancel_at_period_end: true,
        },
      };
      await stripe.updateSubscription(updateParams);
      await stripeSubscriptionsModel.edit({ cancel_at_period_end: 1 }, subscription.id);
    }
  };
  this.cancelLifetimeSubscription = async function (subscription) {
    //TODO check if we refund on this or not
    //we could make a fixed refund amount
    //right now we just cancel it locally and refund is never as it is a onetime product thing.
    let subscriptionEdited = await stripeSubscriptionsModel.edit({ status: 5 }, parseInt(subscription.id));
    if (!subscriptionEdited) {
      throw new Error("Couldn't edit subscription");
    }
    let subscriptionLog = await stripeSubscriptionsLogModel.getByFields({ subscription_id: parseInt(subscription.id), status: 1 });
    if (!subscriptionLog) {
      throw new Error("Couldn't find relative active subscription log");
    }
    let subscriptionLogEdited = await stripeSubscriptionsLogModel.edit({ status: 0 }, subscriptionLog.id);
    if (!subscriptionLogEdited) {
      throw new Error("Couldn't Edit subscription log");
    }
    return true;
  };
  this.createCustomerWithoutCard = async function (params) {
    let createdCustomer = await stripe.createCustomer(params);

    let userModelEntry = {
      stripe_id: createdCustomer.id,
    };

    let modelEditedUser = await userModel.edit(userModelEntry, this.userId);
    if (!modelEditedUser) {
      throw new Error('Internal error: Error editing user stripe id');
    }
    return modelEditedUser;
  };
  this.createCustomer = async function (params) {
    let createdCustomer = await stripe.createCustomer(params);
    let userModelEntry = {
      stripe_id: createdCustomer.id,
    };
    let editedUserModel = await userModel.edit(userModelEntry, this.userId);
    if (!editedUserModel) {
      throw new Error('Error editing user stripe id');
    }

    let customerCardParams = {
      customerId: createdCustomer.id,
      cardId: createdCustomer.default_source,
    };
    let card = await stripe.retrieveCard(customerCardParams);

    if (card) {
      cardModelEntry = {
        card_last: card.last4 ?? '',
        card_brand: card.brand ?? '',
        card_exp_month: card.exp_month ?? '',
        exp_year: card.exp_year ?? '',
        card_name: createdCustomer.metadata.card_name ?? '',
        stripe_card_customer: card.customer,
        stripe_card_id: card.id,
        is_default: createdCustomer.metadata.is_default,
        user_id: this.userId ?? null,
        role_id: this.roleId ?? null,
      };
      var modelCreatedCard = await stripeCardsModel.insert(cardModelEntry);
      if (!modelCreatedCard) {
        throw new Error('Internal error: Error adding card');
      }
    }
    return modelCreatedCard;
  };

  this.adminCreateProductPrice = async function (productStripeId, productLocalId, price) {
    let priceArgs = {
      unit_amount: convertToCents(price),
      currency: this.currency,
      product: productStripeId,
    };
    let priceCreated = await stripe.createPrice(priceArgs);

    let productModelEditEntry = {
      price,
      price_stripe_id: priceCreated.id,
    };
    let modelEditedProduct = await stripeProductsModel.edit(productModelEditEntry, productLocalId);
    if (!modelEditedProduct) {
      throw new Error('Internal Error: error setting price');
    }
    return priceCreated;
  };

  this._createStripeService = async function (params) {
    let serviceParams = {
      name: params.name,
      description: params.description,
      url: params.url,
      images: params.image ? [params.image] : [],
      active: parseInt(params.status) === 1 ? true : false,
    };

    return await stripe.createProduct(serviceParams);
  };
  this._createStripeProduct = async function (params) {
    let productParams = {
      name: params.name,
      active: parseInt(params.status) === 1 ? true : false,
      images: params.images ? [params.images] : [],
      description: params.description,
      shippable: parseInt(params.shippable) === 1 ? true : false,
      unit_label: params.unit_label,
      statement_descriptor: params.statement_descriptor,
    };

    return await stripe.createProduct(productParams);
  };

  /**
   * [adminCreateProduct                allows an admin to create a physical, digital goods or services]
   * @param  {object}   params          [object that contain needed parameters to create a said product or service]
   * @param  {strine}   type            [string that represents the type of the product]
   * @return {object}                   [product or service stripe id as well as product or service local id and if a product it also returns the price object stripe id]
   */
  this.adminCreateProduct = async function (params, type) {
    if (!params.name) {
      throw new Error('Must provide a name for your product');
    }
    if (!type) {
      throw new Error('Must provide a type for your product');
    }

    if (type === 'PRODUCT') {
      var createdStripeProduct = await this._createStripeProduct(params);
      let productModelEntry = {
        stripe_id: createdStripeProduct.id,
        name: createdStripeProduct.name,
        status: createdStripeProduct.active === true ? 1 : 0,
        description: createdStripeProduct.description ?? '',
        images: createdStripeProduct.images?.length > 0 ? createdStripeProduct.images[0] : '',
        shippable: createdStripeProduct.shippable ?? 0,
        unit_label: createdStripeProduct.unit_label ?? '',
        statement_descriptor: createdStripeProduct.statement_descriptor ?? '',
      };

      let modelCreatedServiceId = await stripeProductsModel.insert(productModelEntry);
      let product = await stripeProductsModel.getByPK(modelCreatedServiceId);

      return {
        productStripeId: product.stripe_id,
        productLocalId: product.id,
      };
    } else if (type === 'SERVICE') {
      var createdStripeService = await this._createStripeService(params);

      let serviceModelEntry = {
        name: createdStripeService.name,
        stripe_id: createdStripeService.id,
        status: createdStripeService.active === true ? 1 : 0,
        image: createdStripeService.images.length > 0 ? createdStripeService.images[0] : '',
        url: createdStripeService.url ?? '',
        description: createdStripeService.description ?? '',
      };
      let modelCreatedServiceId = await stripeServicesModel.insert(serviceModelEntry);
      let service = await stripeServicesModel.getByPK(modelCreatedServiceId);

      return {
        serviceStripeId: service.stripe_id,
        serviceLocalId: service.id,
      };
    }

    throw new Error('Missing plan type parameter.');
  };
  /**
   * [adminUpdateService                allows an admin to update certain field of a service]
   * @param  {object}   params          [object that contain parameters to be edited]
   * @param  {integer}  serviceId       [integer that represents service local primary key (id) in database]
   * @return {object}                   [return updated service object]
   */
  this.adminUpdateService = async function (params, serviceId) {
    let service = await stripeServicesModel.getByPK(serviceId);

    await stripe.updateProduct({ productId: service.stripe_id, params });
    let updateParams = {
      name: params.name,
      status: params.active ? 1 : 0,
    };
    let updatedService = await stripeServicesModel.edit(updateParams, serviceId);
    if (!updatedService) {
      throw new Error('Internal Error: Error editing service');
    }
    return updatedService;
  };
  /**
   * [adminUpdateProduct                allows an admin to update certain field of a product]
   * @param  {object}   params          [object that contain parameters to be edited]
   * @param  {integer}  productId       [integer that represents product local primary key (id) in database]
   * @return {object}                   [return updated product object]
   */
  this.adminUpdateProduct = async function (params, productId) {
    let product = await stripeProductsModel.getByPK(productId);

    await stripe.updateProduct({ productId: product.stripe_id, params });
    let updateParams = {
      name: params.name,
      status: params.active ? 1 : 0,
    };
    let updatedProduct = await stripeProductsModel.edit(updateParams, productId);
    if (!updatedProduct) {
      throw new Error('Internal Error: Error editing product');
    }
    return updatedProduct;
  };
  /**
   * [adminCreateRegularPlan       allows an admin to create subscription plan through admin portal]
   * @param  {object}   params      [object that contain plan parameters]
   * @param  {integer}  planType        [integer that represent plan type in relative to stripe plans table] @see /models/stripe_plans.js type_mapping()
   * @param  {integer}  localProductId  [integer that represent product id in relative to stripe products table]
   * @return {integer}                  [the id of the created plan in database]
   */
  this.adminCreateRegularPlan = async function (params, planType, localServiceId) {
    if (!params.interval) {
      throw new Error('Must have a recurring parameter with interval value set');
    }
    if (!params.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    if (planType === null || undefined) {
      throw new Error('Must provide plan type');
    }

    let service = await stripeServicesModel.getByPK(localServiceId);

    let stripePlanCreated = await this._createStripeRegularPlan(params, service);

    let planModelEntry = {
      nickname: stripePlanCreated.nickname,
      stripe_id: stripePlanCreated.id,
      stripe_product_id: stripePlanCreated.product,
      amount: stripePlanCreated.unit_amount / 100,
      interval: stripePlansModel.inverse_interval_mapping(stripePlanCreated.recurring.interval),
      interval_count: stripePlanCreated.recurring.interval_count,
      trial_period_days: stripePlanCreated.recurring.trial_period_days ?? 0,
      service_id: localServiceId,
      status: stripePlanCreated.active === true ? 1 : 0,
      type: parseInt(planType),
    };

    let modelCreatedPlan = await stripePlansModel.insert(planModelEntry);

    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this._createStripeRegularPlan = async function (params, service) {
    let stripeSubscriptionPlanParams = {
      nickname: params.nickname,
      currency: this.currency,
      unit_amount: convertToCents(params.amount),
      product: service.stripe_id,
      recurring: {
        interval: stripePlansModel.interval_mapping()[params.interval],
        interval_count: params.interval_count,
        trial_period_days: params.trial_period_days,
      },
      active: parseInt(params.status) === 1 ? true : false,
    };
    return await stripe.createPrice(stripeSubscriptionPlanParams);
  };
  this._createStripeLifetimePlan = async function (params, service) {
    //stripe doesn't have lifetime plans
    //how it works is a price is created with no recurring parameter as a single time product
    //which acts and dealt with internally within our system as a lifetime plan.
    let stripeSubscriptionPlanParams = {
      nickname: params.nickname,
      currency: this.currency,
      unit_amount: convertToCents(params.amount),
      product: service.stripe_id,
      active: parseInt(params.status) === 1 ? true : false,
    };
    return await stripe.createPrice(stripeSubscriptionPlanParams);
  };
  this._createStripeTrialOnlyPlan = async function (params, service) {
    let trialOnlyPlanParams = {
      nickname: params.nickname,
      currency: this.currency,
      unit_amount: convertToCents(params.amount),
      recurring: {
        interval: stripePlansModel.interval_mapping()[params.interval],
        interval_count: params.interval_count,
      },
      product: service.stripe_id,
      active: parseInt(params.status) === 1 ? true : false,
    };
    return await stripe.createPrice(trialOnlyPlanParams);
  };
  this._deactivateStripeLifetimePlan = async function (planStripeId) {
    //stripe doesn't allow deleting a price. will be set to unactive instead
    return await stripe.updatePrice({ priceId: planStripeId, params: { active: false } });
  };

  this.adminCreateLifetimePlan = async function (params, planType, localServiceId) {
    if (!params.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    if (planType === null || undefined) {
      throw new Error('Must provide plan type');
    }
    if (parseInt(params.interval) !== 4) {
      throw new Error('Interval must be "forever".');
    }

    let service = await stripeServicesModel.getByPK(localServiceId);
    let stripePlanCreated = await this._createStripeLifetimePlan(params, service);

    let planModelEntry = {
      stripe_product_id: stripePlanCreated.product ?? '',
      stripe_id: stripePlanCreated.id ?? '',
      amount: stripePlanCreated.unit_amount / 100,
      interval: 4,
      interval_count: null,
      trial_period_days: null,
      nickname: stripePlanCreated.nickname ?? '',
      service_id: localServiceId,
      status: stripePlanCreated.active === true ? 1 : 0,
      type: parseInt(planType),
    };

    let modelCreatedPlan = await stripePlansModel.insert(planModelEntry);
    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }

    return modelCreatedPlan;
  };

  this.adminCreateTrialPlan = async function (params, planType, localServiceId) {
    if (!params.interval) {
      throw new Error('Must have a recurring parameter with interval value set');
    }
    if (!params.nickname) {
      throw new Error('Must have a display name');
    }
    if (!localServiceId) {
      throw new Error('Must provide system product id');
    }
    if (planType === null || undefined) {
      throw new Error('Must provide plan type');
    }

    let service = await stripeServicesModel.getByPK(localServiceId);
    let priceCreated = await this._createStripeTrialOnlyPlan(params, service);

    let planModelEntry = {
      stripe_product_id: priceCreated.product,
      stripe_id: priceCreated.id,
      amount: priceCreated.unit_amount / 100,
      interval: stripePlansModel.inverse_interval_mapping(priceCreated.recurring.interval),
      interval_count: priceCreated.recurring.interval_count,
      trial_period_days: priceCreated.recurring.trial_period_days ?? 0,
      nickname: priceCreated.nickname,
      service_id: localServiceId,
      status: priceCreated.active ? 1 : 0,
      type: parseInt(planType),
    };
    let modelCreatedPlan = await stripePlansModel.insert(planModelEntry);
    if (!modelCreatedPlan) {
      throw new Error('Internal error: error creating plan');
    }
    return modelCreatedPlan;
  };

  this.adminEditPlan = async function (params, priceId) {
    let price = await stripePlansModel.getByPK(priceId);
    await stripe.updatePrice({ priceId: price.stripe_id, params });
    let updateParams = {
      nickname: params.nickname,
      status: params.active ? 1 : 0,
    };
    let updatedPrice = await stripePlansModel.edit(updateParams, priceId);
    if (!updatedPrice) {
      throw new Error('Internal error: error editing plan');
    }
    return updatedPrice;
  };
  this.adminCancelSubscription = async function (subscriptionId) {
    let subscriptionToCancel = await stripeSubscriptionsModel.getByPK(subscriptionId);
    let subscriptionPlan = await stripePlansModel.getByPK(subscriptionToCancel.plan_id);
    if (!subscriptionToCancel || !subscriptionPlan) {
      throw new Error('No subscription or plan of that id');
    }
    // let subscirptionType = subscriptionPlan.type;
    let subscirptionType = 3;
    //if normal subscription
    switch (subscirptionType) {
      case 0:
      case 3:
      case 4:
        let cancelSubscriptionParams = {
          subscriptionId: subscriptionToCancel.stripe_id,
          params: {
            prorate: this.prorate,
            invoice_now: true,
          },
        };
        let subscriptionCanceled = await stripe.cancelSubscription(cancelSubscriptionParams);
        let localCancellationParams = {
          status: stripeSubscriptionsModel.inverse_status_mapping()[subscriptionCanceled.status],
        };
        await stripeSubscriptionsModel.edit(localCancellationParams, subscriptionId);
        return subscriptionCanceled;
      default:
        throw new Error('Something wrong');
    }
  };
  this.userAddCard = async function (cardParams) {
    let createdCard = await stripe.createCard(cardParams);

    if (createdCard) {
      if (createdCard.metadata.is_default == '1') {
        let customerUpdateParams = {
          customerId: createdCard.customer,
          params: { default_source: createdCard.id },
        };
        await stripe.updateCustomer(customerUpdateParams);
        let defaultCards = await stripeCardsModel.getAll({ is_default: 1 });
        if (defaultCards.length > 0) {
          defaultCards.forEach(async (card) => {
            await stripeCardsModel.edit({ is_default: 0 }, card.id);
          });
        }
      }
      cardModelEntry = {
        card_last: createdCard.last4 ?? '',
        card_brand: createdCard.brand ?? '',
        card_exp_month: createdCard.exp_month ?? '',
        exp_year: createdCard.exp_year ?? '',
        card_name: createdCard.metadata.card_name ?? '',
        stripe_card_customer: createdCard.customer,
        stripe_card_id: createdCard.id,
        is_default: createdCard.metadata.is_default,
        user_id: this.userId ?? null,
        role_id: this.roleId ?? null,
      };
      var modelCreatedCard = await stripeCardsModel.insert(cardModelEntry);
      if (!modelCreatedCard) {
        throw new Error('Internal error: Error adding card');
      }
    }
    return modelCreatedCard;
  };
}
