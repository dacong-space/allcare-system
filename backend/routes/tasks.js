const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json({ code: 0, data: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: 'Server error' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json({ code: 0, data: task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: 'Server error' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Task.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ code: 1, msg: 'Not found' });
    }
    const updatedTask = await Task.findByPk(id);
    res.json({ code: 0, data: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: 'Server error' });
  }
});

module.exports = router;
