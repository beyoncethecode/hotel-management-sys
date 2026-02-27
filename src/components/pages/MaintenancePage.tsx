import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { MaintenanceRequests } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequests | null>(null);
  const [formData, setFormData] = useState({
    issueDescription: '',
    locationRoomNumber: '',
    priorityLevel: 'Medium',
    repairStatus: 'Pending',
    dateReported: '',
    dateResolved: '',
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<MaintenanceRequests>('maintenancerequests');
    setRequests(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportedDate = new Date(formData.dateReported);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reportedDate > today) {
      alert('Reported date cannot be in the future');
      return;
    }

    if (formData.dateResolved) {
      const resolvedDate = new Date(formData.dateResolved);
      if (resolvedDate < reportedDate) {
        alert('Resolved date cannot be before reported date');
        return;
      }
    }

    const requestData = {
      _id: editingRequest?._id || crypto.randomUUID(),
      issueDescription: formData.issueDescription,
      locationRoomNumber: formData.locationRoomNumber,
      priorityLevel: formData.priorityLevel,
      repairStatus: formData.repairStatus,
      dateReported: formData.dateReported,
      dateResolved: formData.dateResolved || undefined,
    };

    if (editingRequest) {
      setRequests(requests.map(r => r._id === editingRequest._id ? { ...r, ...requestData } : r));
      await BaseCrudService.update('maintenancerequests', requestData);
    } else {
      setRequests([...requests, requestData]);
      await BaseCrudService.create('maintenancerequests', requestData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (request: MaintenanceRequests) => {
    setEditingRequest(request);
    setFormData({
      issueDescription: request.issueDescription || '',
      locationRoomNumber: request.locationRoomNumber || '',
      priorityLevel: request.priorityLevel || 'Medium',
      repairStatus: request.repairStatus || 'Pending',
      dateReported: request.dateReported ? format(new Date(request.dateReported), "yyyy-MM-dd'T'HH:mm") : '',
      dateResolved: request.dateResolved ? format(new Date(request.dateResolved), "yyyy-MM-dd'T'HH:mm") : '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setRequests(requests.filter(r => r._id !== id));
    await BaseCrudService.delete('maintenancerequests', id);
  };

  const resetForm = () => {
    setEditingRequest(null);
    setFormData({
      issueDescription: '',
      locationRoomNumber: '',
      priorityLevel: 'Medium',
      repairStatus: 'Pending',
      dateReported: '',
      dateResolved: '',
    });
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            MAINTENANCE
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingRequest ? 'EDIT REQUEST' : 'ADD NEW REQUEST'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-heading text-sm">Issue Description</Label>
                  <Textarea
                    required
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="font-heading text-sm">Location / Room Number</Label>
                  <Input
                    required
                    value={formData.locationRoomNumber}
                    onChange={(e) => setFormData({ ...formData, locationRoomNumber: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Priority Level</Label>
                    <Select value={formData.priorityLevel} onValueChange={(value) => setFormData({ ...formData, priorityLevel: value })}>
                      <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Repair Status</Label>
                    <Select value={formData.repairStatus} onValueChange={(value) => setFormData({ ...formData, repairStatus: value })}>
                      <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Date Reported</Label>
                    <Input
                      required
                      type="datetime-local"
                      max={today}
                      value={formData.dateReported}
                      onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Date Resolved (Optional)</Label>
                    <Input
                      type="datetime-local"
                      min={formData.dateReported}
                      value={formData.dateResolved}
                      onChange={(e) => setFormData({ ...formData, dateResolved: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                  {editingRequest ? 'Update Request' : 'Create Request'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : requests.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No maintenance requests found. Add your first request!</p>
            </div>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <Wrench className="w-6 h-6 text-secondary" />
                      {request.locationRoomNumber}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`font-paragraph text-xs px-3 py-1 rounded-full ${
                        request.priorityLevel === 'Critical' ? 'bg-destructive text-destructiveforeground' :
                        request.priorityLevel === 'High' ? 'bg-primary text-primary-foreground' :
                        request.priorityLevel === 'Medium' ? 'bg-lavenderspot text-primary-foreground' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {request.priorityLevel}
                      </span>
                      <span className={`font-paragraph text-xs px-3 py-1 rounded-full ${
                        request.repairStatus === 'Completed' ? 'bg-secondary text-secondary-foreground' :
                        request.repairStatus === 'In Progress' ? 'bg-lavenderspot text-primary-foreground' :
                        'bg-primary text-primary-foreground'
                      }`}>
                        {request.repairStatus}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Issue</p>
                        <p className="font-paragraph text-sm text-black">{request.issueDescription}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Reported</p>
                        <p className="font-paragraph text-sm text-black">
                          {request.dateReported ? format(new Date(request.dateReported), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </p>
                      </div>
                      {request.dateResolved && (
                        <div>
                          <p className="font-heading text-xs text-black/60">Resolved</p>
                          <p className="font-paragraph text-sm text-black">
                            {format(new Date(request.dateResolved), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(request)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(request._id)}
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
