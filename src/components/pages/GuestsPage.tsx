import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Guests } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guests | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    identificationNumber: '',
    specialRequests: '',
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<Guests>('guests');
    setGuests(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const guestData = {
      _id: editingGuest?._id || crypto.randomUUID(),
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      identificationNumber: formData.identificationNumber,
      specialRequests: formData.specialRequests,
    };

    if (editingGuest) {
      setGuests(guests.map(g => g._id === editingGuest._id ? { ...g, ...guestData } : g));
      await BaseCrudService.update('guests', guestData);
    } else {
      setGuests([...guests, guestData]);
      await BaseCrudService.create('guests', guestData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (guest: Guests) => {
    setEditingGuest(guest);
    setFormData({
      fullName: guest.fullName || '',
      email: guest.email || '',
      phoneNumber: guest.phoneNumber || '',
      dateOfBirth: guest.dateOfBirth ? format(new Date(guest.dateOfBirth), 'yyyy-MM-dd') : '',
      address: guest.address || '',
      identificationNumber: guest.identificationNumber || '',
      specialRequests: guest.specialRequests || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setGuests(guests.filter(g => g._id !== id));
    await BaseCrudService.delete('guests', id);
  };

  const resetForm = () => {
    setEditingGuest(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: '',
      identificationNumber: '',
      specialRequests: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            GUESTS
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-lavenderspot text-primary-foreground hover:bg-lavenderspot/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingGuest ? 'EDIT GUEST' : 'ADD NEW GUEST'}
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
                    <Label className="font-heading text-sm">Date of Birth</Label>
                    <Input
                      required
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">ID Number</Label>
                    <Input
                      required
                      value={formData.identificationNumber}
                      onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Address</Label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div>
                  <Label className="font-heading text-sm">Special Requests</Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-lavenderspot text-primary-foreground hover:bg-lavenderspot/90 rounded-full">
                  {editingGuest ? 'Update Guest' : 'Create Guest'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : guests.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No guests found. Add your first guest!</p>
            </div>
          ) : (
            guests.map((guest, index) => (
              <motion.div
                key={guest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <User className="w-6 h-6 text-lavenderspot" />
                      {guest.fullName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Email</p>
                        <p className="font-paragraph text-sm text-black">{guest.email}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Phone</p>
                        <p className="font-paragraph text-sm text-black">{guest.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Address</p>
                        <p className="font-paragraph text-sm text-black">{guest.address}</p>
                      </div>
                      {guest.specialRequests && (
                        <div>
                          <p className="font-heading text-xs text-black/60">Special Requests</p>
                          <p className="font-paragraph text-sm text-black">{guest.specialRequests}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(guest)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(guest._id)}
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
