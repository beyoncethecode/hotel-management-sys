import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { HousekeepingTasks } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Brush } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<HousekeepingTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<HousekeepingTasks | null>(null);
  const [formData, setFormData] = useState({
    taskDescription: '',
    roomNumber: '',
    status: 'Pending',
    assignedStaff: '',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<HousekeepingTasks>('housekeepingtasks');
    setTasks(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      alert('Due date cannot be in the past');
      return;
    }

    const taskData = {
      _id: editingTask?._id || crypto.randomUUID(),
      taskDescription: formData.taskDescription,
      roomNumber: formData.roomNumber,
      status: formData.status,
      assignedStaff: formData.assignedStaff,
      dueDate: formData.dueDate,
      notes: formData.notes,
    };

    if (editingTask) {
      setTasks(tasks.map(t => t._id === editingTask._id ? { ...t, ...taskData } : t));
      await BaseCrudService.update('housekeepingtasks', taskData);
    } else {
      setTasks([...tasks, taskData]);
      await BaseCrudService.create('housekeepingtasks', taskData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (task: HousekeepingTasks) => {
    setEditingTask(task);
    setFormData({
      taskDescription: task.taskDescription || '',
      roomNumber: task.roomNumber || '',
      status: task.status || 'Pending',
      assignedStaff: task.assignedStaff || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      notes: task.notes || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setTasks(tasks.filter(t => t._id !== id));
    await BaseCrudService.delete('housekeepingtasks', id);
  };

  const resetForm = () => {
    setEditingTask(null);
    setFormData({
      taskDescription: '',
      roomNumber: '',
      status: 'Pending',
      assignedStaff: '',
      dueDate: '',
      notes: '',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            HOUSEKEEPING
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingTask ? 'EDIT TASK' : 'ADD NEW TASK'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-heading text-sm">Task Description</Label>
                  <Input
                    required
                    value={formData.taskDescription}
                    onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    placeholder="e.g., Clean and sanitize room"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Room Number</Label>
                    <Input
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Assigned Staff</Label>
                    <Input
                      required
                      value={formData.assignedStaff}
                      onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Due Date</Label>
                    <Input
                      required
                      type="date"
                      min={today}
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : tasks.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No tasks found. Add your first housekeeping task!</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <Brush className="w-6 h-6 text-primary" />
                      Room {task.roomNumber}
                    </CardTitle>
                    <span className={`font-paragraph text-sm px-3 py-1 rounded-full inline-block w-fit ${
                      task.status === 'Completed' ? 'bg-secondary text-secondary-foreground' :
                      task.status === 'In Progress' ? 'bg-lavenderspot text-primary-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {task.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Task</p>
                        <p className="font-paragraph text-sm text-black">{task.taskDescription}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Assigned To</p>
                        <p className="font-paragraph text-sm text-black">{task.assignedStaff}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Due Date</p>
                        <p className="font-paragraph text-sm text-black">
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                      {task.notes && (
                        <div>
                          <p className="font-heading text-xs text-black/60">Notes</p>
                          <p className="font-paragraph text-sm text-black">{task.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(task)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(task._id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructiveforeground"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
