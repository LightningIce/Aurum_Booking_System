export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const bookingData = req.body;

    const {
      bookingId,
      guestName,
      guestEmail,
      roomName,
      checkin,
      checkout,
      nights,
      guests,
      totalPrice
    } = bookingData;

    if (!guestEmail) {
      return res.status(400).json({ error: 'guestEmail is required' });
    }

    // EmailJS API Endpoint via REST
    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY, // Optional, but good for backend requests
      template_params: {
        to_email: guestEmail,
        guest_name: guestName,
        booking_id: bookingId,
        room_name: roomName,
        checkin_date: checkin,
        checkout_date: checkout,
        nights_count: nights,
        guests_count: guests,
        total_price: totalPrice
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS Error: ${errorText}`);
    }

    return res.status(200).json({ success: true, message: 'Receipt sent via EmailJS' });
  } catch (error: any) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: error.message || 'Error sending email' });
  }
}