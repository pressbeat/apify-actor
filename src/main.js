/**
 * PressBeat - Guaranteed Press Article Actor
 * 
 * Order guaranteed published articles for your brand.
 * $500 for DR30+ publication with do-follow backlink.
 * 90-day money-back guarantee.
 */

import { Actor } from 'apify';

// Pricing configuration (single plan only due to Apify $500 limit)
const PRICING = {
  price: 500,
  event: 'order-article',
  description: 'Guaranteed article (DR30+ minimum, DR70 average)',
  deliveryDays: 30,
};

/**
 * Send notification email via Resend
 */
async function sendNotificationEmail(orderDetails) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.FROM_NOTIFICATIONS_EMAIL || 'kevin@pressbeat.io';

  if (!resendApiKey) {
    console.log('[PressBeat] RESEND_API_KEY not configured, skipping email notification');
    console.log('[PressBeat] Order details:', JSON.stringify(orderDetails, null, 2));
    return;
  }

  const { website_url, email, topic, country, notes, orderId, timestamp } = orderDetails;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; border: 1px solid #e2e8f0;">
    
    <h1 style="color: #0f172a; margin: 0 0 24px 0;">🎉 New Apify Order!</h1>
    
    <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 24px; font-weight: bold; color: #0f172a;">
        GUARANTEED ARTICLE - $${PRICING.price}
      </p>
      <p style="margin: 8px 0 0 0; color: #64748b;">${PRICING.description}</p>
    </div>

    <h2 style="color: #0f172a; font-size: 16px; margin: 24px 0 12px 0;">Customer Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 120px;">Email:</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Website:</td>
        <td style="padding: 8px 0;"><a href="${website_url}" style="color: #2563eb;">${website_url}</a></td>
      </tr>
      ${topic ? `
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Topic:</td>
        <td style="padding: 8px 0; color: #0f172a;">${topic}</td>
      </tr>
      ` : ''}
      ${country ? `
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Country:</td>
        <td style="padding: 8px 0; color: #0f172a;">${country}</td>
      </tr>
      ` : ''}
      ${notes ? `
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Notes:</td>
        <td style="padding: 8px 0; color: #0f172a;">${notes}</td>
      </tr>
      ` : ''}
    </table>

    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        Order ID: ${orderId}<br>
        Source: Apify Actor<br>
        Time: ${timestamp}
      </p>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PressBeat Apify <apify@pressbeat.io>',
        to: notificationEmail,
        subject: `🎉 New Apify Order: $${PRICING.price} - ${website_url}`,
        html: emailHtml,
      }),
    });

    if (response.ok) {
      console.log(`[PressBeat] Notification email sent to ${notificationEmail}`);
    } else {
      console.error('[PressBeat] Failed to send email:', await response.text());
    }
  } catch (error) {
    console.error('[PressBeat] Email error:', error.message);
  }
}

/**
 * Send confirmation email to customer
 */
async function sendCustomerConfirmation(orderDetails) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return;
  }

  const { website_url, email, orderId } = orderDetails;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; border: 1px solid #e2e8f0;">
    
    <h1 style="color: #0f172a; margin: 0 0 24px 0;">Thank you for your order!</h1>
    
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">
      Your guaranteed article order has been received. Our team will start working on it immediately.
    </p>

    <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Your Order</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f172a;">
        Guaranteed Article - $${PRICING.price}
      </p>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">
        ${PRICING.description}
      </p>
    </div>

    <h2 style="color: #0f172a; font-size: 16px; margin: 24px 0 12px 0;">What happens next?</h2>
    <ol style="color: #334155; line-height: 1.8; padding-left: 20px;">
      <li>We analyze your website and identify the best story angles</li>
      <li>We pitch relevant journalists at DR30+ publications</li>
      <li>Once a journalist is interested, we'll notify you</li>
      <li>Your article goes live with a do-follow backlink</li>
    </ol>

    <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; color: #047857; font-size: 14px;">
        <strong>90-Day Guarantee:</strong> If we don't deliver within 90 days, you get a full refund.
      </p>
    </div>

    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="margin: 0; color: #64748b; font-size: 13px;">
        Questions? Reply to this email or contact <a href="mailto:kevin@pressbeat.io" style="color: #2563eb;">kevin@pressbeat.io</a>
      </p>
      <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
        Order ID: ${orderId}
      </p>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PressBeat <orders@pressbeat.io>',
        to: email,
        bcc: process.env.FROM_NOTIFICATIONS_EMAIL || 'kevin@pressbeat.io',
        subject: `Your PressBeat order is confirmed! (Guaranteed Article)`,
        html: emailHtml,
      }),
    });

    if (response.ok) {
      console.log(`[PressBeat] Confirmation email sent to ${email}`);
    }
  } catch (error) {
    console.error('[PressBeat] Customer email error:', error.message);
  }
}

// Main Actor logic
await Actor.init();

try {
  // Get input
  const input = await Actor.getInput();
  
  if (!input) {
    throw new Error('No input provided');
  }

  const { website_url, email, topic, country, notes } = input;

  // Validate required fields
  if (!website_url) {
    throw new Error('Website URL is required.');
  }
  if (!email) {
    throw new Error('Email is required.');
  }

  console.log(`[PressBeat] Processing order for ${website_url}`);

  // Charge the event
  const chargeResult = await Actor.charge({
    eventName: PRICING.event,
  });

  console.log(`[PressBeat] Charged event: ${PRICING.event}`);

  // Check if charge was successful
  if (chargeResult.eventChargeLimitReached) {
    console.log('[PressBeat] User spending limit reached');
    await Actor.pushData({
      success: false,
      error: 'Spending limit reached. Please increase your limit in Apify settings to at least $500.',
    });
    await Actor.exit();
  }

  // Generate order ID
  const orderId = `APF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // Order details
  const orderDetails = {
    orderId,
    website_url,
    email,
    topic: topic || null,
    country: country || null,
    notes: notes || null,
    price: PRICING.price,
    source: 'apify',
    timestamp,
  };

  // Send notification emails (async, don't block)
  await Promise.all([
    sendNotificationEmail(orderDetails),
    sendCustomerConfirmation(orderDetails),
  ]);

  // Push result to dataset
  await Actor.pushData({
    success: true,
    message: 'Order placed successfully!',
    order: {
      id: orderId,
      price: PRICING.price,
      website_url,
      status: 'pending',
      estimated_delivery: `${PRICING.deliveryDays} days`,
      guarantee: '90-day money-back if not delivered',
      publication_quality: 'DR30+ minimum, DR70 average',
    },
    next_steps: [
      'You will receive a confirmation email shortly',
      'Our team will analyze your website and identify story angles',
      'We will pitch relevant journalists at high-authority publications',
      'You will be notified when a journalist shows interest',
    ],
    support: 'kevin@pressbeat.io',
  });

  console.log(`[PressBeat] Order ${orderId} completed successfully`);

} catch (error) {
  console.error('[PressBeat] Error:', error.message);
  
  await Actor.pushData({
    success: false,
    error: error.message,
    support: 'kevin@pressbeat.io',
  });
}

await Actor.exit();
