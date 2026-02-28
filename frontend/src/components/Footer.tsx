import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold">Ohr Transportation LLC</h3>
            <p className="text-sm text-muted-foreground">
              Professional trucking and logistics services across North America. Regional, long haul,
              expedited, and dedicated freight delivery solutions.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Regional Delivery</li>
              <li>Long Haul Transportation</li>
              <li>Expedited Services</li>
              <li>Dedicated Freight</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@ohrtransportation.com</li>
              <li>Phone: 1-800-OHR-SHIP</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
