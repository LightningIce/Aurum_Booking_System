import StaticPageLayout from '../components/StaticPageLayout';

export default function AboutPage() {
  return (
    <StaticPageLayout 
      title="Our Heritage" 
      subtitle="The Story of Aurum Grand"
      heroImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
    >
      <p className="lead">
        Established in 1912, Aurum Grand Hotel stands as a beacon of timeless elegance in the heart of the city's Luxury District.
      </p>
      <h2>A Century of Excellence</h2>
      <p>
        For over a hundred years, Aurum Grand has played host to royalty, world leaders, and legends of the silver screen. Our walls hold the stories of grand galas, historic meetings, and the quiet moments of weary travelers seeking sanctuary.
      </p>
      <p>
        Recently restored to its original splendor, the hotel combines the architectural grandeur of the Gilded Age with the sophisticated amenities required by today's discerning guest.
      </p>
      <h2>Our Philosophy</h2>
      <p>
        At Aurum Grand, our philosophy is simple: hospitality is an art form. Every interaction is an opportunity to create a lasting memory. From our signature butler service to our Michelin-starred dining experiences, every detail is meticulously curated to ensure your stay is nothing short of extraordinary.
      </p>
    </StaticPageLayout>
  );
}
