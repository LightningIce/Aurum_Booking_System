import StaticPageLayout from '../components/StaticPageLayout';

export default function TermsPage() {
  return (
    <StaticPageLayout 
      title="Terms of Service" 
      subtitle="The Fine Print"
    >
      <p>
        Last Updated: May 2026
      </p>
      <p>
        By using the Aurum Grand Hotel website and services, you agree to comply with and be bound by the following terms and conditions.
      </p>
      <h2>Reservations</h2>
      <p>
        All reservations are subject to availability and confirmation. A valid payment method is required at the time of booking to guarantee your residence.
      </p>
      <h2>Cancellation Policy</h2>
      <p>
        Unless otherwise stated in your specific booking terms, cancellations must be made at least 24 hours prior to the scheduled arrival date to avoid a penalty of one night's room rate.
      </p>
      <h2>Prototype Notice</h2>
      <p>
        This application is a prototype developed for demonstration purposes. No real hotel bookings are being made, and no real financial transactions are being processed. Aurum Grand Hotel is a fictional entity created for this technical demonstration.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        Aurum Grand Hotel is not liable for any direct or indirect damages arising out of your use of this demonstration website.
      </p>
    </StaticPageLayout>
  );
}
