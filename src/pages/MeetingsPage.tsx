import StaticPageLayout from '../components/StaticPageLayout';

export default function MeetingsPage() {
  return (
    <StaticPageLayout 
      title="Meetings & Events" 
      subtitle="Gather in Grandeur"
      heroImage="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000"
    >
      <p className="lead">
        From intimate board meetings to grand wedding celebrations, Aurum Grand Hotel provides a stunning backdrop for your most important events.
      </p>
      <h2>The Grand Ballroom</h2>
      <p>
        Breathtaking chandeliers and double-height ceilings make our ballroom the premier choice for galas and large-scale celebrations. Accommodating up to 500 guests, it is a space where memories are made.
      </p>
      <h2>Executive Boardrooms</h2>
      <p>
        Our private boardrooms offer a discreet and professional environment for strategic discussions, equipped with the latest audiovisual technology and supported by our dedicated event staff.
      </p>
      <h2>Weddings</h2>
      <p>
        Let our experienced wedding coordinators turn your vision into reality. From the ceremony to the final dance, we ensure every detail of your special day is flawlessly executed.
      </p>
    </StaticPageLayout>
  );
}
