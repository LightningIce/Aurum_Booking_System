import StaticPageLayout from '../components/StaticPageLayout';

export default function OffersPage() {
  return (
    <StaticPageLayout 
      title="Special Offers" 
      subtitle="Exclusive Experiences"
      heroImage="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000"
    >
      <p className="lead">
        Enhance your stay with our curated selection of special offers and exclusive packages.
      </p>
      <h2>Weekend Retreat</h2>
      <p>
        Enjoy a 15% discount on three-night stays arriving on Friday or Saturday. Includes a complimentary bottle of sparkling wine upon arrival and late check-out.
      </p>
      <h2>The Aurum Indulgence</h2>
      <p>
        Book any Suite for two nights and receive a RM 200 dining credit valid at any of our onsite restaurants and bars, plus a private butler consultation.
      </p>
      <h2>Early Booker Advantage</h2>
      <p>
        Plan ahead and save. Reservations made at least 30 days in advance enjoy a 20% reduction on our Best Available Rate.
      </p>
    </StaticPageLayout>
  );
}
