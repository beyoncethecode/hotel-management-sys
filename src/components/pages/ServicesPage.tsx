import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { HotelServices } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

export default function ServicesPage() {
  const [services, setServices] = useState<HotelServices[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<HotelServices | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    itemPrice: '',
    serviceDuration: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<HotelServices>('hotelservices');
    setServices(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      _id: editingService?._id || crypto.randomUUID(),
      itemName: formData.itemName,
      itemDescription: formData.itemDescription,
      itemPrice: parseFloat(formData.itemPrice),
      serviceDuration: formData.serviceDuration,
      isAvailable: formData.isAvailable,
      itemImage: 'https://static.wixstatic.com/media/e40e66_300c1efd1ad940ca87bae7a61811a825~mv2.png?originWidth=384&originHeight=256',
    };

    if (editingService) {
      setServices(services.map(s => s._id === editingService._id ? { ...s, ...serviceData } : s));
      await BaseCrudService.update('hotelservices', serviceData);
    } else {
      setServices([...services, serviceData]);
      await BaseCrudService.create('hotelservices', serviceData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (service: HotelServices) => {
    setEditingService(service);
    setFormData({
      itemName: service.itemName || '',
      itemDescription: service.itemDescription || '',
      itemPrice: service.itemPrice?.toString() || '',
      serviceDuration: service.serviceDuration || '',
      isAvailable: service.isAvailable ?? true,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setServices(services.filter(s => s._id !== id));
    await BaseCrudService.delete('hotelservices', id);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      itemName: '',
      itemDescription: '',
      itemPrice: '',
      serviceDuration: '',
      isAvailable: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            SERVICES
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingService ? 'EDIT SERVICE' : 'ADD NEW SERVICE'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-heading text-sm">Service Name</Label>
                  <Input
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Price</Label>
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
                    <Label className="font-heading text-sm">Duration</Label>
                    <Input
                      required
                      value={formData.serviceDuration}
                      onChange={(e) => setFormData({ ...formData, serviceDuration: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                      placeholder="e.g., 60 minutes"
                    />
                  </div>
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
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label className="font-heading text-sm">Available</Label>
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : services.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No services found. Add your first service!</p>
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <Image 
                      src={service.itemImage || 'https://static.wixstatic.com/media/e40e66_e9f4f69c91de4317987fef22206ecbf6~mv2.png?originWidth=384&originHeight=256'}
                      alt={service.itemName || 'Service'}
                      className="w-full h-full object-cover"
                      width={400}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-secondary" />
                      {service.itemName}
                    </CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-xl text-secondary">
                        ${service.itemPrice}
                      </span>
                      <span className={`font-paragraph text-sm px-3 py-1 rounded-full ${
                        service.isAvailable ? 'bg-secondary text-secondary-foreground' : 'bg-lavenderspot text-primary-foreground'
                      }`}>
                        {service.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-sm text-black/70 mb-2">
                      {service.itemDescription}
                    </p>
                    <p className="font-paragraph text-sm text-black/60 mb-4">
                      Duration: {service.serviceDuration}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(service)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(service._id)}
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
