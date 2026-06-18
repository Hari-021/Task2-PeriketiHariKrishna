const express = require('express');
const router = express.Router();
const ReminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');

// @route   GET /api/reminders/upcoming
// @desc    Get subscriptions renewing in the next 7 days
// @access  Private
router.get('/upcoming', auth, ReminderController.getUpcomingReminders);

module.exports = router;
