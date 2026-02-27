import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-cream border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl md:text-3xl text-black">
            HOTEL MANAGER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/rooms" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Rooms
                </Link>
                <Link to="/reservations" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Reservations
                </Link>
                <Link to="/guests" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Guests
                </Link>
                <Link to="/staff" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Staff
                </Link>
                <Link to="/services" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Services
                </Link>
                <Link to="/payments" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Payments
                </Link>
                <Link to="/housekeeping" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Housekeeping
                </Link>
                <Link to="/maintenance" className="font-paragraph text-base text-black hover:text-primary transition-colors">
                  Maintenance
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" className="rounded-full border-2 border-black">
                    <User className="w-4 h-4 mr-2" />
                    {member?.profile?.nickname || 'Profile'}
                  </Button>
                </Link>
                <Button 
                  onClick={actions.logout}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={actions.login}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t-2 border-black pt-4">
            <nav className="flex flex-col gap-4">
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/rooms" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Rooms
                  </Link>
                  <Link 
                    to="/reservations" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reservations
                  </Link>
                  <Link 
                    to="/guests" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Guests
                  </Link>
                  <Link 
                    to="/staff" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff
                  </Link>
                  <Link 
                    to="/services" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    to="/payments" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Payments
                  </Link>
                  <Link 
                    to="/housekeeping" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Housekeeping
                  </Link>
                  <Link 
                    to="/maintenance" 
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Maintenance
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile"
                    className="font-paragraph text-base text-black hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button 
                    onClick={() => {
                      actions.logout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    actions.login();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
