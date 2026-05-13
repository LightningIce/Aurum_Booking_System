import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AboutPage from './pages/AboutPage';
import DiningPage from './pages/DiningPage';
import SpaPage from './pages/SpaPage';
import MeetingsPage from './pages/MeetingsPage';
import OffersPage from './pages/OffersPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="flex-grow print:w-full print:m-0 print:p-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
            <Route path="/my-booking" element={<MyBookingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/spa" element={<SpaPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

