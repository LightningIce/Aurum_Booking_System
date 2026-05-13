import StaticPageLayout from '../components/StaticPageLayout';

export default function DiningPage() {
  return (
    <StaticPageLayout 
      title="Dine & Drink" 
      subtitle="Culinary Excellence"
      heroImage="https://images.unsplash.com/photo-1550966841-3ee7adac166e?auto=format&fit=crop&q=80&w=2000"
    >
      <p className="lead">
        Embark on a gastronomic journey at Aurum Grand Hotel, where our world-class restaurants and bars offer an array of exquisite flavors.
      </p>
      <h2>The Gilded Room</h2>
      <p>
        Our flagship Michelin-starred restaurant offers a contemporary interpretation of classic French cuisine. Executive Chef Andre DuPont curates a seasonal menu using only the finest local and imported ingredients.
      </p>
      <h2>The Aurum Lounge</h2>
      <p>
        Experience the art of the cocktail in our historic lounge. With rare spirits, artisanal bitters, and an atmosphere of refined sophistication, it is the perfect setting for a pre-dinner drink or a late-night nightcap.
      </p>
      <h2>Rooftop Terrace</h2>
      <p>
        Dine under the stars with panoramic views of the Manhattan skyline. Our rooftop venue specializes in Mediterranean-inspired small plates and an extensive wine list.
      </p>
    </StaticPageLayout>
  );
}
