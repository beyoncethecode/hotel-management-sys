import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-black py-16">
      <div className="max-w-[100rem] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <h3 className="font-heading text-3xl text-cream mb-4">
              HOTEL MANAGER
            </h3>
            <p className="font-paragraph text-base text-cream/80">
              Professional hospitality management platform designed for modern hotels
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-xl text-cream mb-4">
              OPERATIONS
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/rooms" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Rooms
              </Link>
              <Link to="/reservations" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Reservations
              </Link>
              <Link to="/guests" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Guests
              </Link>
              <Link to="/staff" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Staff
              </Link>
            </nav>
          </div>

          {/* Services Links */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-xl text-cream mb-4">
              SERVICES
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/services" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Hotel Services
              </Link>
              <Link to="/payments" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Payments
              </Link>
              <Link to="/housekeeping" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Housekeeping
              </Link>
              <Link to="/maintenance" className="font-paragraph text-base text-cream/80 hover:text-cream transition-colors">
                Maintenance
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-xl text-cream mb-4">
              SUPPORT
            </h4>
            <div className="flex flex-col gap-3">
              <p className="font-paragraph text-base text-cream/80">
                support@hotelmanager.com
              </p>
              <p className="font-paragraph text-base text-cream/80">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-cream/60">
              © {new Date().getFullYear()} Hotel Manager. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-paragraph text-sm text-cream/60 hover:text-cream transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-paragraph text-sm text-cream/60 hover:text-cream transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
