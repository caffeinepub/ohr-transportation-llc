import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { page: Page; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'quote', label: 'Get Quote' },
    { page: 'booking', label: 'Book Shipment' },
    { page: 'tracking', label: 'Track Shipment' },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/generated/ohr-transportation-logo-transparent.dim_200x200.png"
            alt="Ohr Transportation LLC"
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">Ohr Transportation LLC</span>
            <span className="text-xs text-muted-foreground">Logistics Solutions</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.page}
              variant={currentPage === item.page ? 'default' : 'ghost'}
              onClick={() => handleNavigate(item.page)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Button
                key={item.page}
                variant={currentPage === item.page ? 'default' : 'ghost'}
                onClick={() => handleNavigate(item.page)}
                className="justify-start"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
