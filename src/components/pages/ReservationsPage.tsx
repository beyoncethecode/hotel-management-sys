import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Reservations } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservations | null>(null);
  const [formData, setFormData] = useState({
    reservationNumber: '',
    guestName: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    status: 'Confirmed',
  });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<Reservations>('reservations');
    setReservations(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      alert('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const reservationData = {
      _id: editingReservation?._id || crypto.randomUUID(),
      reservationNumber: formData.reservationNumber,
      guestName: formData.guestName,
      roomNumber: formData.roomNumber,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: formData.status,
    };

    if (editingReservation) {
      setReservations(reservations.map(r => r._id === editingReservation._id ? { ...r, ...reservationData } : r));
      await BaseCrudService.update('reservations', reservationData);
    } else {
      setReservations([...reservations, reservationData]);
      await BaseCrudService.create('reservations', reservationData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (reservation: Reservations) => {
    setEditingReservation(reservation);
    setFormData({
      reservationNumber: reservation.reservationNumber || '',
      guestName: reservation.guestName || '',
      roomNumber: reservation.roomNumber || '',
      checkInDate: reservation.checkInDate ? format(new Date(reservation.checkInDate), 'yyyy-MM-dd') : '',
      checkOutDate: reservation.checkOutDate ? format(new Date(reservation.checkOutDate), 'yyyy-MM-dd') : '',
      status: reservation.status || 'Confirmed',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setReservations(reservations.filter(r => r._id !== id));
    await BaseCrudService.delete('reservations', id);
  };

  const resetForm = () => {
    setEditingReservation(null);
    setFormData({
      reservationNumber: '',
      guestName: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      status: 'Confirmed',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            RESERVATIONS
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Reservation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingReservation ? 'EDIT RESERVATION' : 'ADD NEW RESERVATION'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Reservation Number</Label>
                    <Input
                      required
                      value={formData.reservationNumber}
                      onChange={(e) => setFormData({ ...formData, reservationNumber: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                      placeholder="RES-001"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Room Number</Label>
                    <Input
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                      placeholder="101"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Guest Name</Label>
                  <Input
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Check-In Date</Label>
                    <Input
                      required
                      type="date"
                      min={today}
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Check-Out Date</Label>
                    <Input
                      required
                      type="date"
                      min={formData.checkInDate || today}
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Checked In">Checked In</SelectItem>
                      <SelectItem value="Checked Out">Checked Out</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                  {editingReservation ? 'Update Reservation' : 'Create Reservation'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : reservations.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No reservations found. Add your first reservation!</p>
            </div>
          ) : (
            reservations.map((reservation, index) => (
              <motion.div
                key={reservation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-secondary" />
                      {reservation.reservationNumber}
                    </CardTitle>
                    <span className={`font-paragraph text-sm px-3 py-1 rounded-full inline-block w-fit ${
                      reservation.status === 'Confirmed' ? 'bg-secondary text-secondary-foreground' :
                      reservation.status === 'Checked In' ? 'bg-primary text-primary-foreground' :
                      reservation.status === 'Cancelled' ? 'bg-destructive text-destructiveforeground' :
                      'bg-lavenderspot text-primary-foreground'
                    }`}>
                      {reservation.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Guest</p>
                        <p className="font-paragraph text-base text-black">{reservation.guestName}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Room</p>
                        <p className="font-paragraph text-base text-black">{reservation.roomNumber}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-heading text-xs text-black/60">Check-In</p>
                          <p className="font-paragraph text-sm text-black">
                            {reservation.checkInDate ? format(new Date(reservation.checkInDate), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="font-heading text-xs text-black/60">Check-Out</p>
                          <p className="font-paragraph text-sm text-black">
                            {reservation.checkOutDate ? format(new Date(reservation.checkOutDate), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(reservation)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(reservation._id)}
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
