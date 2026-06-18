const SubscriptionService = require('../services/subscriptionService');

class ReminderController {
  static async getUpcomingReminders(req, res, next) {
    try {
      const upcoming = await SubscriptionService.getUpcomingReminders(req.user.id);
      res.json(upcoming);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReminderController;
