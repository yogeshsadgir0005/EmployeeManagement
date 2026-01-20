const express = require('express');
const router = express.Router();
const {
  getEmployees, getEmployeeById, createEmployee, updateEmployeeProfile, deleteEmployee,
  addHike, updateSalaryRecord, deleteSalaryRecord,
  addTraining, updateTrainingRecord, deleteTraining,
  addReward, updateRewardRecord, deleteReward
} = require('../controllers/employeeController');

// Core Routes
router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployeeProfile).delete(deleteEmployee);

// Salary
router.post('/:id/hike', addHike);
router.put('/:id/hike/:recordId', updateSalaryRecord); // Edit
router.delete('/:id/hike/:recordId', deleteSalaryRecord);

// Training
router.post('/:id/training', addTraining);
router.put('/:id/training/:recordId', updateTrainingRecord); // Edit
router.delete('/:id/training/:recordId', deleteTraining);

// Rewards
router.post('/:id/reward', addReward);
router.put('/:id/reward/:recordId', updateRewardRecord); // Edit
router.delete('/:id/reward/:recordId', deleteReward);

module.exports = router;