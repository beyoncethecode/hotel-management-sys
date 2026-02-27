import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { HotelRooms } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<HotelRooms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<HotelRooms | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    itemPrice: '',
    itemDescription: '',
    roomType: '',
    maxOccupancy: '',
    roomStatus: 'Available',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<HotelRooms>('rooms');
    setRooms(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const roomData = {
      _id: editingRoom?._id || crypto.randomUUID(),
      itemName: formData.itemName,
      itemPrice: parseFloat(formData.itemPrice),
      itemDescription: formData.itemDescription,
      roomType: formData.roomType,
      maxOccupancy: parseInt(formData.maxOccupancy),
      roomStatus: formData.roomStatus,
      itemImage: 'https://static.wixstatic.com/media/e40e66_657e9525b9d04e5f8dc132fa21796f55~mv2.png?originWidth=384&originHeight=256',
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r._id === editingRoom._id ? { ...r, ...roomData } : r));
      await BaseCrudService.update('rooms', roomData);
    } else {
      setRooms([...rooms, roomData]);
      await BaseCrudService.create('rooms', roomData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (room: HotelRooms) => {
    setEditingRoom(room);
    setFormData({
      itemName: room.itemName || '',
      itemPrice: room.itemPrice?.toString() || '',
      itemDescription: room.itemDescription || '',
      roomType: room.roomType || '',
      maxOccupancy: room.maxOccupancy?.toString() || '',
      roomStatus: room.roomStatus || 'Available',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setRooms(rooms.filter(r => r._id !== id));
    await BaseCrudService.delete('rooms', id);
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      itemName: '',
      itemPrice: '',
      itemDescription: '',
      roomType: '',
      maxOccupancy: '',
      roomStatus: 'Available',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            ROOMS
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingRoom ? 'EDIT ROOM' : 'ADD NEW ROOM'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-heading text-sm">Room Name</Label>
                  <Input
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Price per Night</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      value={formData.itemPrice}
                      onChange={(e) => setFormData({ ...formData, itemPrice: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Max Occupancy</Label>
                    <Input
                      required
                      type="number"
                      value={formData.maxOccupancy}
                      onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Room Type</Label>
                  <Input
                    required
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    placeholder="e.g., Deluxe, Suite, Standard"
                  />
                </div>
                <div>
                  <Label className="font-heading text-sm">Status</Label>
                  <Select value={formData.roomStatus} onValueChange={(value) => setFormData({ ...formData, roomStatus: value })}>
                    <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-heading text-sm">Description</Label>
                  <Textarea
                    required
                    value={formData.itemDescription}
                    onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : rooms.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No rooms found. Add your first room!</p>
            </div>
          ) : (
            rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <Image 
                      src={room.itemImage || 'https://static.wixstatic.com/media/e40e66_926cd04838ed4b1ca1de9962196d2d1b~mv2.png?originWidth=384&originHeight=256'}
                      alt={room.itemName || 'Room'}
                      className="w-full h-full object-cover"
                      width={400}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black">
                      {room.itemName}
                    </CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-xl text-primary">
                        ${room.itemPrice}/night
                      </span>
                      <span className={`font-paragraph text-sm px-3 py-1 rounded-full ${
                        room.roomStatus === 'Available' ? 'bg-secondary text-secondary-foreground' :
                        room.roomStatus === 'Occupied' ? 'bg-primary text-primary-foreground' :
                        'bg-lavenderspot text-primary-foreground'
                      }`}>
                        {room.roomStatus}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-sm text-black/70 mb-4">
                      {room.itemDescription}
                    </p>
                    <div className="flex gap-2 text-sm font-paragraph text-black/60 mb-4">
                      <span>{room.roomType}</span>
                      <span>•</span>
                      <span>Max {room.maxOccupancy} guests</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(room)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(room._id)}
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
