import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { StaffMembers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMembers | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    department: '',
    email: '',
    phoneNumber: '',
    shiftStartTime: '',
    shiftEndTime: '',
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<StaffMembers>('staff');
    setStaff(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const staffData = {
      _id: editingStaff?._id || crypto.randomUUID(),
      fullName: formData.fullName,
      jobTitle: formData.jobTitle,
      department: formData.department,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      shiftStartTime: formData.shiftStartTime,
      shiftEndTime: formData.shiftEndTime,
    };

    if (editingStaff) {
      setStaff(staff.map(s => s._id === editingStaff._id ? { ...s, ...staffData } : s));
      await BaseCrudService.update('staff', staffData);
    } else {
      setStaff([...staff, staffData]);
      await BaseCrudService.create('staff', staffData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (member: StaffMembers) => {
    setEditingStaff(member);
    setFormData({
      fullName: member.fullName || '',
      jobTitle: member.jobTitle || '',
      department: member.department || '',
      email: member.email || '',
      phoneNumber: member.phoneNumber || '',
      shiftStartTime: member.shiftStartTime || '',
      shiftEndTime: member.shiftEndTime || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setStaff(staff.filter(s => s._id !== id));
    await BaseCrudService.delete('staff', id);
  };

  const resetForm = () => {
    setEditingStaff(null);
    setFormData({
      fullName: '',
      jobTitle: '',
      department: '',
      email: '',
      phoneNumber: '',
      shiftStartTime: '',
      shiftEndTime: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            STAFF
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingStaff ? 'EDIT STAFF MEMBER' : 'ADD NEW STAFF MEMBER'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-heading text-sm">Full Name</Label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Job Title</Label>
                    <Input
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Department</Label>
                    <Input
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Email</Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Phone Number</Label>
                    <Input
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Shift Start Time</Label>
                    <Input
                      required
                      type="time"
                      value={formData.shiftStartTime}
                      onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Shift End Time</Label>
                    <Input
                      required
                      type="time"
                      value={formData.shiftEndTime}
                      onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : staff.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No staff members found. Add your first staff member!</p>
            </div>
          ) : (
            staff.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <UserCog className="w-6 h-6 text-primary" />
                      {member.fullName}
                    </CardTitle>
                    <p className="font-paragraph text-sm text-black/70">{member.jobTitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Department</p>
                        <p className="font-paragraph text-sm text-black">{member.department}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Email</p>
                        <p className="font-paragraph text-sm text-black">{member.email}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Phone</p>
                        <p className="font-paragraph text-sm text-black">{member.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Shift</p>
                        <p className="font-paragraph text-sm text-black">
                          {member.shiftStartTime} - {member.shiftEndTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(member)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(member._id)}
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
