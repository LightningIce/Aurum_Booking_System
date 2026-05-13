import StaticPageLayout from '../components/StaticPageLayout';

export default function PrivacyPage() {
  return (
    <StaticPageLayout 
      title="Privacy Policy" 
      subtitle="Your Privacy Matters"
    >
      <p>
        Last Updated: May 2026
      </p>
      <p>
        At Aurum Grand Hotel, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information that you provide directly to us when you make a reservation, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, and booking preferences.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        Your information is used to process your reservations, communicate with you regarding your stay, and provide you with information about our services and special offers that may be of interest to you.
      </p>
      <h2>Data Security</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
      </p>
      <h2>Demo Disclaimer</h2>
      <p>
        Note: This website is a demonstration prototype. Information entered here is stored locally in your browser's localStorage and is not transmitted to any external server or processed by real payment gateways.
      </p>
    </StaticPageLayout>
  );
}
