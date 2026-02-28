import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuotePage from './pages/QuotePage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import { ServiceType } from './backend';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface NavigationState {
  page: Page;
  selectedService?: ServiceType;
}

function App() {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    page: 'home',
  });

  const navigate = (page: Page, selectedService?: ServiceType) => {
    setNavigationState({ page, selectedService });
  };

  const renderPage = () => {
    const key = `${navigationState.page}-${navigationState.selectedService || 'default'}`;
    
    switch (navigationState.page) {
      case 'home':
        return <HomePage key={key} onNavigate={navigate} />;
      case 'quote':
        return (
          <QuotePage
            key={key}
            onNavigate={navigate}
            preSelectedService={navigationState.selectedService}
          />
        );
      case 'booking':
        return (
          <BookingPage
            key={key}
            onNavigate={navigate}
            preSelectedService={navigationState.selectedService}
          />
        );
      case 'tracking':
        return <TrackingPage key={key} onNavigate={navigate} />;
      default:
        return <HomePage key={key} onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPage={navigationState.page} onNavigate={(page) => navigate(page)} />
      <main className="flex-1">
        <div
          key={navigationState.page}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
