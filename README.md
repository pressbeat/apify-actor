# PressBeat - Guaranteed Press Article

Order a guaranteed published article for your brand directly from Apify.

## What You Get

| Price | Publication | Delivery | Guarantee |
|-------|-------------|----------|-----------|
| **$500** | DR30+ minimum | ~30 days | 90-day money-back |

**Included:**
- ✅ Real editorial coverage (not sponsored posts)
- ✅ Do-follow backlink to your website
- ✅ Average DR70 placement
- ✅ SEO & AI Search visibility

## How It Works

1. **Run the Actor** with your website URL
2. **We analyze** your website and identify the best story angles
3. **We pitch** relevant journalists at high-authority publications
4. **You get notified** when a journalist shows interest
5. **Article goes live** with a do-follow backlink

## Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `website_url` | ✅ | Your company website URL |
| `email` | ✅ | Your email for order updates |
| `topic` | ❌ | Preferred article topic/angle |
| `country` | ❌ | Target country for publication |
| `notes` | ❌ | Additional requests |

## Example Input

```json
{
  "website_url": "https://mycompany.com",
  "email": "ceo@mycompany.com",
  "topic": "Our new AI product launch",
  "country": "US"
}
```

## Example Output

```json
{
  "success": true,
  "message": "Order placed successfully!",
  "order": {
    "id": "APF-1706123456789-ABC123",
    "price": 500,
    "website_url": "https://mycompany.com",
    "status": "pending",
    "estimated_delivery": "30 days",
    "guarantee": "90-day money-back if not delivered",
    "publication_quality": "DR30+ minimum, DR70 average"
  },
  "next_steps": [
    "You will receive a confirmation email shortly",
    "Our team will analyze your website and identify story angles",
    "We will pitch relevant journalists at high-authority publications",
    "You will be notified when a journalist shows interest"
  ],
  "support": "kevin@pressbeat.io"
}
```

## Target Publications

We pitch journalists at top-tier publications including:
- Reuters, TechCrunch, Forbes, Wired, VentureBeat
- Business Insider, Sifted, The Verge, Entrepreneur
- Industry-specific and regional publications
- 1.7M journalists across 160 countries

## 90-Day Money-Back Guarantee

If we don't deliver your guaranteed article within 90 days, you get a full refund. No questions asked.

## About PressBeat

PressBeat is the #1 AI-native PR agency. We use AI to match your story with journalists who are actively writing about your industry.

- **Website:** https://pressbeat.io
- **API Documentation:** https://pressbeat.io/developers
- **Support:** kevin@pressbeat.io

## Pricing

This Actor uses **Pay-Per-Event (PPE)** pricing:
- `order-article`: $500 per order

You are only charged when you place an order.

---

**Need a higher-tier placement (DR50+)?** Contact us directly at kevin@pressbeat.io for our Premium plan.
