const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/summary
// @desc    Get dashboard KPI metrics summary
// @access  Private
router.get('/summary', auth, DashboardController.getSummary);

// @route   GET /api/dashboard/analytics
// @desc    Get dashboard charts / trends analytics
// @access  Private
router.get('/analytics', auth, DashboardController.getAnalytics);

module.exports = router;
