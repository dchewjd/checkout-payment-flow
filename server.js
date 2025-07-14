const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;
const PROCESSING_CHANNEL_ID = process.env.PROCESSING_CHANNEL_ID;
const BASE_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  console.log("Request params:", JSON.stringify({
    amount: 6540,
    currency: "GBP",
    reference: "ORD-123A",
    description: "Payment for Guitars and Amps",
    billing_descriptor: {
      name: "Jia Tsang",
      city: "London",
    },
    customer: {
      email: "jia.tsang@example.com",
      name: "Jia Tsang",
    },
    shipping: {
      address: {
        address_line1: "123 High St.",
        address_line2: "Flat 456",
        city: "London",
        zip: "SW1A 1AA",
        country: "GB",
      },
      phone: {
        number: "1234567890",
        country_code: "+44",
      },
    },
    billing: {
      address: {
        address_line1: "123 High St.",
        address_line2: "Flat 456",
        city: "London",
        zip: "SW1A 1AA",
        country: "GB",
      },
      phone: {
        number: "1234567890",
        country_code: "+44",
      },
    },
    risk: {
      enabled: true,
    },
    success_url: `${BASE_URL}/?status=succeeded`,
    failure_url: `${BASE_URL}/?status=failed`,
    metadata: {},
    items: [
      {
        name: "Guitar",
        quantity: 1,
        unit_price: 1635,
      },
      {
        name: "Amp",
        quantity: 3,
        unit_price: 1635,
      },
    ],
    processing_channel_id: `${PROCESSING_CHANNEL_ID}`
  }, null, 2));
  
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 6540,
        currency: "GBP",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",
        billing_descriptor: {
          name: "Jia Tsang",
          city: "London",
        },
        customer: {
          email: "jia.tsang@example.com",
          name: "Jia Tsang",
        },
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        risk: {
          enabled: true,
        },
        success_url: `${BASE_URL}/?status=succeeded`,
        failure_url: `${BASE_URL}/?status=failed`,
        metadata: {},
        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 1635,
          },
          {
            name: "Amp",
            quantity: 3,
            unit_price: 1635,
          },
        ],
        processing_channel_id: `${PROCESSING_CHANNEL_ID}`
      }),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Node server listening on port ${PORT}: ${BASE_URL}/`)
);
