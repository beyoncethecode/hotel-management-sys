import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Bed, 
  Calendar, 
  Users, 
  UserCog, 
  Sparkles, 
  CreditCard, 
  Brush, 
  Wrench 
} from 'lucide-react';

export default function DashboardPage() {
  const { member } = useMember();
  const [stats, setStats] = useState({
    rooms: 0,
    reservations: 0,
    guests: 0,
    staff: 0,
    services: 0,
    payments: 0,
    housekeeping: 0,
    maintenance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    const [rooms, reservations, guests, staff, services, payments, housekeeping, maintenance] = await Promise.all([
      BaseCrudService.getAll('rooms', {}, { limit: 1 }),
      BaseCrudService.getAll('reservations', {}, { limit: 1 }),
      BaseCrudService.getAll('guests', {}, { limit: 1 }),
      BaseCrudService.getAll('staff', {}, { limit: 1 }),
      BaseCrudService.getAll('hotelservices', {}, { limit: 1 }),
      BaseCrudService.getAll('payments', {}, { limit: 1 }),
      BaseCrudService.getAll('housekeepingtasks', {}, { limit: 1 }),
      BaseCrudService.getAll('maintenancerequests', {}, { limit: 1 }),
    ]);

    setStats({
      rooms: rooms.totalCount,
      reservations: reservations.totalCount,
      guests: guests.totalCount,
      staff: staff.totalCount,
      services: services.totalCount,
      payments: payments.totalCount,
      housekeeping: housekeeping.totalCount,
      maintenance: maintenance.totalCount,
    });
    setIsLoading(false);
  };

  const modules = [
    { 
      title: 'ROOMS', 
      count: stats.rooms, 
      icon: Bed, 
      link: '/rooms', 
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    { 
      title: 'RESERVATIONS', 
      count: stats.reservations, 
      icon: Calendar, 
      link: '/reservations', 
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    },
    { 
      title: 'GUESTS', 
      count: stats.guests, 
      icon: Users, 
      link: '/guests', 
      color: 'bg-lavenderspot',
      textColor: 'text-primary-foreground'
    },
    { 
      title: 'STAFF', 
      count: stats.staff, 
      icon: UserCog, 
      link: '/staff', 
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    { 
      title: 'SERVICES', 
      count: stats.services, 
      icon: Sparkles, 
      link: '/services', 
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    },
    { 
      title: 'PAYMENTS', 
      count: stats.payments, 
      icon: CreditCard, 
      link: '/payments', 
      color: 'bg-lavenderspot',
      textColor: 'text-primary-foreground'
    },
    { 
      title: 'HOUSEKEEPING', 
      count: stats.housekeeping, 
      icon: Brush, 
      link: '/housekeeping', 
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    { 
      title: 'MAINTENANCE', 
      count: stats.maintenance, 
      icon: Wrench, 
      link: '/maintenance', 
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[100rem] mx-auto px-8 py-16 min-h-[60vh]">
        <div className="mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black mb-4">
            DASHBOARD
          </h1>
          <p className="font-paragraph text-xl text-black/70">
            Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'Manager'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={module.link}>
                  <Card className={`${module.color} border-2 border-black rounded-2xl hover:scale-105 transition-transform cursor-pointer min-h-[200px]`}>
                    <CardHeader>
                      <CardTitle className={`font-heading text-2xl ${module.textColor} flex items-center gap-3`}>
                        <Icon className="w-8 h-8" />
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <p className={`font-heading text-5xl ${module.textColor}`}>
                          {module.count}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
