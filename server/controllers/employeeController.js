const Employee = require('../models/Employee');

// --- CORE CONTROLLERS ---

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, designation, department, currentSalary } = req.body;
    const initialSalary = { amount: Number(currentSalary), incrementPercentage: 0, reason: 'Joining Salary' };
    
    const employee = await Employee.create({
      firstName, lastName, email, designation, department,
      currentSalary: Number(currentSalary),
      salaryHistory: [initialSalary]
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmployeeProfile = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- SUB-DOCUMENT CONTROLLERS (Add, Delete, UPDATE) ---

// 1. SALARY
const addHike = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const employee = await Employee.findById(req.params.id);
    const oldSalary = employee.currentSalary;
    const percentage = ((amount - oldSalary) / oldSalary) * 100;

    employee.currentSalary = amount;
    employee.salaryHistory.push({
      amount,
      incrementPercentage: percentage.toFixed(2),
      reason,
      effectiveDate: new Date()
    });
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSalaryRecord = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { "_id": req.params.id, "salaryHistory._id": req.params.recordId },
      { 
        "$set": { 
          "salaryHistory.$.amount": amount,
          "salaryHistory.$.reason": reason
        }
      },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSalaryRecord = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.salaryHistory = employee.salaryHistory.filter(item => item._id.toString() !== req.params.recordId);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. TRAINING
const addTraining = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.trainingHistory.push(req.body);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTrainingRecord = async (req, res) => {
  try {
    const { title, cost } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { "_id": req.params.id, "trainingHistory._id": req.params.recordId },
      { 
        "$set": { 
          "trainingHistory.$.title": title,
          "trainingHistory.$.cost": cost
        }
      },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.trainingHistory = employee.trainingHistory.filter(item => item._id.toString() !== req.params.recordId);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. REWARDS
const addReward = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.rewards.push(req.body);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRewardRecord = async (req, res) => {
  try {
    const { title, giftValue, notes } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { "_id": req.params.id, "rewards._id": req.params.recordId },
      { 
        "$set": { 
          "rewards.$.title": title,
          "rewards.$.giftValue": giftValue,
          "rewards.$.notes": notes
        }
      },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReward = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.rewards = employee.rewards.filter(item => item._id.toString() !== req.params.recordId);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEmployees, getEmployeeById, createEmployee, updateEmployeeProfile, deleteEmployee,
  addHike, updateSalaryRecord, deleteSalaryRecord,
  addTraining, updateTrainingRecord, deleteTraining,
  addReward, updateRewardRecord, deleteReward
};