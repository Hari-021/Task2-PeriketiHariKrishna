const mongoose = require('mongoose');
const { getIsFallback, readData, writeData } = require('../config/database');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true },
  category: { type: String, required: true },
  plan: { type: String }, // e.g. Family, Pro
  planType: { 
    type: String, 
    enum: ['Monthly', 'Yearly'], 
    required: true,
    default: 'Monthly'
  },
  billingCycle: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  billingDate: { type: Date, required: true, default: Date.now },
  renewalDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Cancelled', 'Expired'], 
    default: 'Active',
    set: function(val) {
      if (!val) return 'Active';
      const map = {
        'active': 'Active',
        'paused': 'Cancelled',
        'cancelled': 'Cancelled',
        'expired': 'Expired',
        'archived': 'Cancelled'
      };
      return map[val.toLowerCase()] || val;
    }
  },
  paymentMethod: { type: String },
  autoRenew: { type: Boolean, default: true },
  notes: { type: String },
  reminderDaysBefore: { type: Number, default: 7 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Post-load / JSON transformation to return compatible fields to the frontend
SubscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    // Map capitalized DB status back to frontend lowercase expected status
    if (ret.status) {
      const map = {
        'Active': 'active',
        'Cancelled': 'paused', // Map Cancelled to paused for frontend compatibility
        'Expired': 'expired'
      };
      ret.status = map[ret.status] || ret.status.toLowerCase();
    }
    return ret;
  }
});

SubscriptionSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    if (ret.status) {
      const map = {
        'Active': 'active',
        'Cancelled': 'paused',
        'Expired': 'expired'
      };
      ret.status = map[ret.status] || ret.status.toLowerCase();
    }
    return ret;
  }
});

// Middleware to sync billingCycle and planType
SubscriptionSchema.pre('save', function(next) {
  if (this.billingCycle) {
    this.planType = this.billingCycle.toLowerCase() === 'yearly' ? 'Yearly' : 'Monthly';
  } else if (this.planType) {
    this.billingCycle = this.planType === 'Yearly' ? 'yearly' : 'monthly';
  }
  next();
});

const MongooseSubscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

// Helper to map DB status for local JSON file
const mapStatusToFrontend = (status) => {
  if (!status) return 'active';
  const map = {
    'Active': 'active',
    'Cancelled': 'paused',
    'Expired': 'expired'
  };
  return map[status] || status.toLowerCase();
};

const mapStatusToDb = (status) => {
  if (!status) return 'Active';
  const map = {
    'active': 'Active',
    'paused': 'Cancelled',
    'cancelled': 'Cancelled',
    'expired': 'Expired',
    'archived': 'Cancelled'
  };
  return map[status.toLowerCase()] || status;
};

class Subscription {
  static async find(query = {}) {
    const mappedQuery = { ...query };
    if (mappedQuery.status && typeof mappedQuery.status === 'string') {
      mappedQuery.status = mapStatusToDb(mappedQuery.status);
    }

    if (!getIsFallback()) {
      return await MongooseSubscription.find(mappedQuery);
    }

    const data = readData();
    return data.subscriptions.filter(sub => {
      return Object.keys(mappedQuery).every(key => {
        if (mappedQuery[key] && typeof mappedQuery[key] === 'object' && mappedQuery[key].$gte !== undefined) {
          return sub[key] >= mappedQuery[key].$gte;
        }
        return sub[key] === mappedQuery[key];
      });
    }).map(sub => ({ 
      ...sub, 
      _id: sub.id,
      status: mapStatusToFrontend(sub.status)
    }));
  }

  static async findById(id) {
    if (!getIsFallback()) {
      return await MongooseSubscription.findById(id);
    }
    const data = readData();
    const sub = data.subscriptions.find(s => s.id === id);
    return sub ? { 
      ...sub, 
      _id: sub.id,
      status: mapStatusToFrontend(sub.status)
    } : null;
  }

  static async create(subData) {
    const billingCycle = subData.billingCycle || 'monthly';
    const planType = billingCycle.toLowerCase() === 'yearly' ? 'Yearly' : 'Monthly';
    const dbStatus = mapStatusToDb(subData.status || 'active');

    if (!getIsFallback()) {
      return await MongooseSubscription.create({
        userId: subData.userId,
        serviceName: subData.serviceName,
        category: subData.category,
        plan: subData.plan || '',
        planType: planType,
        billingCycle: billingCycle,
        amount: Number(subData.amount),
        currency: subData.currency || 'USD',
        billingDate: subData.billingDate || new Date(),
        renewalDate: new Date(subData.renewalDate),
        status: dbStatus,
        paymentMethod: subData.paymentMethod || '',
        autoRenew: subData.autoRenew !== undefined ? subData.autoRenew : true,
        notes: subData.notes || '',
        reminderDaysBefore: subData.reminderDaysBefore !== undefined ? Number(subData.reminderDaysBefore) : 7
      });
    }

    const data = readData();
    const now = new Date().toISOString();
    const newSub = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      userId: subData.userId,
      serviceName: subData.serviceName,
      category: subData.category,
      plan: subData.plan || '',
      planType: planType,
      billingCycle: billingCycle,
      amount: Number(subData.amount),
      currency: subData.currency || 'USD',
      billingDate: subData.billingDate || now,
      renewalDate: new Date(subData.renewalDate).toISOString(),
      status: dbStatus,
      paymentMethod: subData.paymentMethod || '',
      autoRenew: subData.autoRenew !== undefined ? subData.autoRenew : true,
      notes: subData.notes || '',
      reminderDaysBefore: subData.reminderDaysBefore !== undefined ? Number(subData.reminderDaysBefore) : 7,
      createdAt: now,
      updatedAt: now
    };
    data.subscriptions.push(newSub);
    writeData(data);
    return { 
      ...newSub, 
      _id: newSub.id,
      status: mapStatusToFrontend(newSub.status)
    };
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const rawUpdate = updateData.$set ? updateData.$set : updateData;
    const mappedUpdate = { ...rawUpdate };

    if (mappedUpdate.status) {
      mappedUpdate.status = mapStatusToDb(mappedUpdate.status);
    }
    if (mappedUpdate.billingCycle) {
      mappedUpdate.planType = mappedUpdate.billingCycle.toLowerCase() === 'yearly' ? 'Yearly' : 'Monthly';
    } else if (mappedUpdate.planType) {
      mappedUpdate.billingCycle = mappedUpdate.planType === 'Yearly' ? 'yearly' : 'monthly';
    }

    if (!getIsFallback()) {
      return await MongooseSubscription.findByIdAndUpdate(id, mappedUpdate, { new: true, ...options });
    }

    const data = readData();
    const subIndex = data.subscriptions.findIndex(s => s.id === id);
    if (subIndex === -1) return null;

    const currentSub = data.subscriptions[subIndex];
    const updatedSub = {
      ...currentSub,
      ...mappedUpdate,
      updatedAt: new Date().toISOString()
    };

    if (updatedSub.amount !== undefined) {
      updatedSub.amount = Number(updatedSub.amount);
    }
    if (updatedSub.reminderDaysBefore !== undefined) {
      updatedSub.reminderDaysBefore = Number(updatedSub.reminderDaysBefore);
    }

    data.subscriptions[subIndex] = updatedSub;
    writeData(data);
    return { 
      ...updatedSub, 
      _id: updatedSub.id,
      status: mapStatusToFrontend(updatedSub.status)
    };
  }

  static async findByIdAndDelete(id) {
    if (!getIsFallback()) {
      return await MongooseSubscription.findByIdAndDelete(id);
    }
    const data = readData();
    const subIndex = data.subscriptions.findIndex(s => s.id === id);
    if (subIndex === -1) return null;

    const deletedSub = data.subscriptions.splice(subIndex, 1)[0];
    writeData(data);
    return { 
      ...deletedSub, 
      _id: deletedSub.id,
      status: mapStatusToFrontend(deletedSub.status)
    };
  }
}

module.exports = Subscription;
