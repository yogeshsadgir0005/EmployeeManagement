const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  designation: String,
  department: String,
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
  currentSalary: { type: Number, required: true },
  
  // RELATIONAL ARRAYS
  trainingHistory: [{
    title: String,
    cost: Number,
    completionDate: Date
  }],
  salaryHistory: [{
    amount: Number,
    incrementPercentage: Number,
    effectiveDate: { type: Date, default: Date.now },
    reason: String
  }],
  rewards: [{
    title: String,
    giftValue: Number,
    dateGiven: { type: Date, default: Date.now },
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);