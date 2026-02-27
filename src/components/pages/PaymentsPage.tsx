import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Payments } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payments | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: '',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    transactionReference: '',
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<Payments>('payments');
    setPayments(result.items);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      _id: editingPayment?._id || crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      transactionReference: formData.transactionReference,
    };

    if (editingPayment) {
      setPayments(payments.map(p => p._id === editingPayment._id ? { ...p, ...paymentData } : p));
      await BaseCrudService.update('payments', paymentData);
    } else {
      setPayments([...payments, paymentData]);
      await BaseCrudService.create('payments', paymentData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (payment: Payments) => {
    setEditingPayment(payment);
    setFormData({
      amount: payment.amount?.toString() || '',
      paymentDate: payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : '',
      paymentMethod: payment.paymentMethod || 'Credit Card',
      status: payment.status || 'Completed',
      transactionReference: payment.transactionReference || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setPayments(payments.filter(p => p._id !== id));
    await BaseCrudService.delete('payments', id);
  };

  const resetForm = () => {
    setEditingPayment(null);
    setFormData({
      amount: '',
      paymentDate: '',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      transactionReference: '',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black">
            PAYMENTS
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-lavenderspot text-primary-foreground hover:bg-lavenderspot/90 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {editingPayment ? 'EDIT PAYMENT' : 'ADD NEW PAYMENT'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Amount</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Payment Date</Label>
                    <Input
                      required
                      type="date"
                      max={today}
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      className="bg-background border-2 border-black rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-heading text-sm">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-background border-2 border-black rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-heading text-sm">Transaction Reference</Label>
                  <Input
                    required
                    value={formData.transactionReference}
                    onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                    className="bg-background border-2 border-black rounded-xl"
                    placeholder="TXN-123456"
                  />
                </div>
                <Button type="submit" className="w-full bg-lavenderspot text-primary-foreground hover:bg-lavenderspot/90 rounded-full">
                  {editingPayment ? 'Update Payment' : 'Create Payment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
          {isLoading ? null : payments.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-paragraph text-xl text-black/60">No payments found. Add your first payment!</p>
            </div>
          ) : (
            payments.map((payment, index) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-cream border-2 border-black rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-black flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-lavenderspot" />
                      ${payment.amount}
                    </CardTitle>
                    <span className={`font-paragraph text-sm px-3 py-1 rounded-full inline-block w-fit ${
                      payment.status === 'Completed' ? 'bg-secondary text-secondary-foreground' :
                      payment.status === 'Pending' ? 'bg-lavenderspot text-primary-foreground' :
                      payment.status === 'Failed' ? 'bg-destructive text-destructiveforeground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {payment.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="font-heading text-xs text-black/60">Payment Method</p>
                        <p className="font-paragraph text-sm text-black">{payment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Transaction Reference</p>
                        <p className="font-paragraph text-sm text-black">{payment.transactionReference}</p>
                      </div>
                      <div>
                        <p className="font-heading text-xs text-black/60">Payment Date</p>
                        <p className="font-paragraph text-sm text-black">
                          {payment.paymentDate ? format(new Date(payment.paymentDate), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(payment)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-2 border-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(payment._id)}
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
