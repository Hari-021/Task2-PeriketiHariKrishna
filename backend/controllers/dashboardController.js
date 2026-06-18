const SubscriptionService = require('../services/subscriptionService');

class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const summary = await SubscriptionService.getDashboardSummary(req.user.id);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req, res, next) {
    try {
      const analytics = await SubscriptionService.getDashboardAnalytics(req.user.id);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
