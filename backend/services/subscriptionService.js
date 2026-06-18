const Subscription = require('../models/Subscription');

const getMonthlyCost = (amount, cycle) => {
  const numAmount = Number(amount) || 0;
  switch (cycle ? cycle.toLowerCase() : 'monthly') {
    case 'weekly':
      return numAmount * (52 / 12);
    case 'monthly':
      return numAmount;
    case 'quarterly':
      return numAmount / 3;
    case 'yearly':
      return numAmount / 12;
    default:
      return numAmount;
  }
};

class SubscriptionService {
  static async createSubscription(userId, data) {
    return await Subscription.create({
      ...data,
      userId
    });
  }

  static async getSubscriptions(userId, queryParams) {
    let list = await Subscription.find({ userId });

    // 1. Search filter (case-insensitive on serviceName)
    if (queryParams.search) {
      const q = queryParams.search.toLowerCase();
      list = list.filter(item => item.serviceName.toLowerCase().includes(q));
    }

    // 2. Category filter
    if (queryParams.category && queryParams.category !== 'All') {
      list = list.filter(item => item.category.toLowerCase() === queryParams.category.toLowerCase());
    }

    // 3. Billing cycle filter
    if (queryParams.billingCycle && queryParams.billingCycle !== 'All') {
      list = list.filter(item => item.billingCycle.toLowerCase() === queryParams.billingCycle.toLowerCase());
    }

    // 4. Status filter
    if (queryParams.status && queryParams.status !== 'All') {
      list = list.filter(item => item.status.toLowerCase() === queryParams.status.toLowerCase());
    }

    // 5. Price range filter
    if (queryParams.minPrice !== undefined && queryParams.minPrice !== '') {
      list = list.filter(item => item.amount >= Number(queryParams.minPrice));
    }
    if (queryParams.maxPrice !== undefined && queryParams.maxPrice !== '') {
      list = list.filter(item => item.amount <= Number(queryParams.maxPrice));
    }

    // 6. Sorting
    const sortBy = queryParams.sortBy || 'renewalDate'; // 'cost', 'renewalDate', 'serviceName'
    const order = queryParams.order === 'desc' ? -1 : 1;

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'cost' || sortBy === 'amount') {
        comp = a.amount - b.amount;
      } else if (sortBy === 'renewalDate') {
        comp = new Date(a.renewalDate) - new Date(b.renewalDate);
      } else if (sortBy === 'serviceName') {
        comp = a.serviceName.localeCompare(b.serviceName);
      }
      return comp * order;
    });

    return list;
  }

  static async getSubscriptionById(id, userId) {
    const sub = await Subscription.findById(id);
    if (!sub) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Enforce ownership
    if (sub.userId.toString() !== userId) {
      const error = new Error('Access denied: You do not own this subscription');
      error.status = 403;
      throw error;
    }

    return sub;
  }

  static async updateSubscription(id, userId, updateData) {
    // Check ownership first
    await this.getSubscriptionById(id, userId);

    const updated = await Subscription.findByIdAndUpdate(id, updateData, { new: true });
    return updated;
  }

  static async deleteSubscription(id, userId) {
    // Check ownership first
    await this.getSubscriptionById(id, userId);

    await Subscription.findByIdAndDelete(id);
    return { message: 'Subscription deleted successfully' };
  }

  static async getDashboardSummary(userId) {
    const list = await Subscription.find({ userId });

    let activeMonthlySpending = 0;
    let activeCount = 0;
    let expiredCount = 0;
    let pausedCount = 0;
    let upcomingRenewalsCount = 0;

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    list.forEach(sub => {
      if (sub.status === 'active') {
        activeCount++;
        activeMonthlySpending += getMonthlyCost(sub.amount, sub.billingCycle);

        // Check if renewal is within the next 7 days
        const renewal = new Date(sub.renewalDate);
        if (renewal >= now && renewal <= nextWeek) {
          upcomingRenewalsCount++;
        }
      } else if (sub.status === 'expired') {
        expiredCount++;
      } else if (sub.status === 'paused') {
        pausedCount++;
      }
    });

    // Recent activity (sorted by updatedAt desc, take top 5)
    const recentActivity = [...list]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return {
      kpis: {
        monthlySpending: Math.round(activeMonthlySpending * 100) / 100,
        yearlySpending: Math.round(activeMonthlySpending * 12 * 100) / 100,
        activeSubscriptions: activeCount,
        upcomingRenewals: upcomingRenewalsCount,
        expiredSubscriptions: expiredCount,
        pausedSubscriptions: pausedCount
      },
      recentActivity
    };
  }

  static async getDashboardAnalytics(userId) {
    const list = await Subscription.find({ userId });

    // 1. Calculate category distribution
    const categoryMap = {};
    list.forEach(sub => {
      if (sub.status === 'active') {
        const cat = sub.category || 'Other';
        const cost = getMonthlyCost(sub.amount, sub.billingCycle);
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, amount: 0, count: 0 };
        }
        categoryMap[cat].amount += cost;
        categoryMap[cat].count += 1;
      }
    });

    const categoryDistribution = Object.values(categoryMap).map(c => ({
      category: c.category,
      amount: Math.round(c.amount * 100) / 100,
      count: c.count
    }));

    // 2. Calculate spending trend over the last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        amount: 0
      });
    }

    months.forEach(month => {
      list.forEach(sub => {
        const createdDate = new Date(sub.createdAt);
        if (createdDate.getFullYear() < month.year || 
           (createdDate.getFullYear() === month.year && createdDate.getMonth() <= month.monthNum)) {
          
          if (sub.status === 'active' || sub.status === 'paused') {
            month.amount += getMonthlyCost(sub.amount, sub.billingCycle);
          }
        }
      });
      month.amount = Math.round(month.amount * 100) / 100;
    });

    // 3. Most expensive subscriptions
    const mostExpensive = list
      .filter(sub => sub.status === 'active')
      .map(sub => ({
        serviceName: sub.serviceName,
        amount: sub.amount,
        billingCycle: sub.billingCycle,
        monthlyEquivalent: Math.round(getMonthlyCost(sub.amount, sub.billingCycle) * 100) / 100
      }))
      .sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent)
      .slice(0, 5);

    return {
      categoryDistribution,
      spendingTrend: months.map(m => ({ name: m.name, amount: m.amount })),
      mostExpensive
    };
  }

  static async getUpcomingReminders(userId) {
    const list = await Subscription.find({ userId });
    
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    return list
      .filter(sub => {
        if (sub.status !== 'active') return false;
        const renewal = new Date(sub.renewalDate);
        return renewal >= now && renewal <= nextWeek;
      })
      .map(sub => {
        const renewal = new Date(sub.renewalDate);
        const diffTime = renewal.getTime() - now.getTime();
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        return {
          id: sub._id,
          serviceName: sub.serviceName,
          category: sub.category,
          amount: sub.amount,
          billingCycle: sub.billingCycle,
          renewalDate: sub.renewalDate,
          daysRemaining: diffDays
        };
      });
  }
}

module.exports = SubscriptionService;
