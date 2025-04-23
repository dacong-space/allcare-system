import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import { getTasks, createTask, updateTask } from '../api/tasks';

const columns = {
  todo: { title: '待办', color: '#ff9800' },
  inProgress: { title: '进行中', color: '#2196f3' },
  done: { title: '已完成', color: '#4caf50' }
};

export default function TaskBoardMUI() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: dayjs().format('YYYY-MM-DD'), assignee: '' });

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    const res = await getTasks();
    if (res.code === 0) {
      const data = { todo: [], inProgress: [], done: [] };
      res.data.forEach(t => { if (data[t.status]) data[t.status].push(t); });
      setTasks(data);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const moved = tasks[source.droppableId][source.index];
    const updates = { status: destination.droppableId };
    await updateTask(moved.id, updates);
    fetchTasks();
  };

  const handleAdd = async () => {
    await createTask(newTask);
    setOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: dayjs().format('YYYY-MM-DD'), assignee: '' });
    fetchTasks();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>任务面板</Typography>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => setOpen(true)}>添加任务</Button>
        </Toolbar>
      </AppBar>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, p: 2, overflowX: 'auto' }}>
          {Object.entries(columns).map(([key, col]) => (
            <Box key={key} sx={{ minWidth: 280 }}>
              <Paper sx={{ p: 1, bgcolor: col.color, color: '#fff' }}><Typography>{col.title}</Typography></Paper>
              <Droppable droppableId={key}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mt: 1, minHeight: 400, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {tasks[key].map((task, idx) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(prov) => (
                          <Paper ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="subtitle1">{task.title}</Typography>
                            <Typography variant="body2">{task.description}</Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>添加新任务</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="标题" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} fullWidth />
          <TextField label="描述" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} fullWidth multiline rows={3} />
          <TextField select label="优先级" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
            <MenuItem value="high">高</MenuItem>
            <MenuItem value="medium">中</MenuItem>
            <MenuItem value="low">低</MenuItem>
          </TextField>
          <TextField label="截止日期" type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField label="负责人" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleAdd}>添加</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
