import StaticPageLayout from '../components/StaticPageLayout';

export default function SpaPage() {
  return (
    <StaticPageLayout 
      title="Spa & Wellness" 
      subtitle="A Sanctuary for the Senses"
      heroImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2000"
    >
      <p className="lead">
        Find balance and serenity at The Aurum Spa, a tranquil escape from the bustling city below.
      </p>
      <h2>Signature Treatments</h2>
      <p>
        Our comprehensive menu of treatments combines traditional techniques with modern science. From our Gold Leaf Facial to our Deep Tissue Restoration session, each treatment is tailored to your specific needs.
      </p>
      <h2>Facilities</h2>
      <p>
        In addition to our private treatment suites, guests can enjoy full access to our thermal circuit, including a Himalayan salt sauna, eucalyptus steam room, and our temperature-controlled infinity pool.
      </p>
      <h2>Fitness Studio</h2>
      <p>
        Maintain your wellness routine in our state-of-the-art fitness center, equipped with the latest Technogym apparatus and available for your use 24 hours a day.
      </p>
    </StaticPageLayout>
  );
}
