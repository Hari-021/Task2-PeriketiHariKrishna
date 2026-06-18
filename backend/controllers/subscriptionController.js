const SubscriptionService = require('../services/subscriptionService');

class SubscriptionController {
  static async getSubscriptions(req, res, next) {
    try {
      const subscriptions = await SubscriptionService.getSubscriptions(req.user.id, req.query);
      res.json(subscriptions);
    } catch (error) {
      next(error);
    }
  }

  static async getSubscriptionById(req, res, next) {
    try {
      const subscription = await SubscriptionService.getSubscriptionById(req.params.id, req.user.id);
      res.json(subscription);
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async createSubscription(req, res, next) {
    try {
      const sub = await SubscriptionService.createSubscription(req.user.id, req.body);
      res.status(201).json(sub);
    } catch (error) {
      next(error);
    }
  }

  static async updateSubscription(req, res, next) {
    try {
      const updated = await SubscriptionService.updateSubscription(req.params.id, req.user.id, req.body);
      res.json(updated);
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async deleteSubscription(req, res, next) {
    try {
      const result = await SubscriptionService.deleteSubscription(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = SubscriptionController;
