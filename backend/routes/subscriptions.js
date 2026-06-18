const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const { subscriptionValidation } = require('../middleware/validation');

// @route   GET /api/subscriptions
// @desc    Get all subscriptions of user (with filter, search, sorting)
// @access  Private
router.get('/', auth, SubscriptionController.getSubscriptions);

// @route   GET /api/subscriptions/:id
// @desc    Get subscription by ID
// @access  Private
router.get('/:id', auth, SubscriptionController.getSubscriptionById);

// @route   POST /api/subscriptions
// @desc    Create a subscription
// @access  Private
router.post('/', [auth, subscriptionValidation], SubscriptionController.createSubscription);

// @route   PUT /api/subscriptions/:id
// @desc    Update subscription
// @access  Private
router.put('/:id', [auth, subscriptionValidation], SubscriptionController.updateSubscription);

// @route   DELETE /api/subscriptions/:id
// @desc    Delete subscription
// @access  Private
router.delete('/:id', auth, SubscriptionController.deleteSubscription);

module.exports = router;
