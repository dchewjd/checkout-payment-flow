require('dotenv').config({ path: '.env.local' });
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;
const PROCESSING_CHANNEL_ID = process.env.PROCESSING_CHANNEL_ID;
const BASE_URL = process.env.RENDER_EXTERNAL_URL;

app.post("/create-payment-sessions", async (req, res) => {
  // Get billing data from request body
  const billingData = req.body;

  // Create payment session data using user input
  const paymentSessionData = {
    amount: 10000, // S$100.00 in cents
    currency: "SGD",
    reference: "SHOES-001",
    description: "Payment for Premium Running Shoes",
    billing_descriptor: {
      name: billingData.name,
      city: billingData.city,
    },
    customer: {
      email: billingData.email,
      name: billingData.name,
    },
    shipping: {
      address: {
        address_line1: billingData.address1,
        address_line2: billingData.address2,
        city: billingData.city,
        zip: billingData.zip,
        country: billingData.country,
      },
      phone: {
        number: billingData.phone,
        country_code: billingData.phoneCountry,
      },
    },
    billing: {
      address: {
        address_line1: billingData.address1,
        address_line2: billingData.address2,
        city: billingData.city,
        zip: billingData.zip,
        country: billingData.country,
      },
      phone: {
        number: billingData.phone,
        country_code: billingData.phoneCountry,
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
        name: "Premium Running Shoes",
        quantity: 1,
        unit_price: 10000, // S$100.00 in cents
      },
    ],
    processing_channel_id: `${PROCESSING_CHANNEL_ID}`
  };
  
  console.log("Request params:", JSON.stringify(paymentSessionData, null, 2));
  
  try {
    const request = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentSessionData),
      }
    );

    const parsedPayload = await request.json();
    
    if (!request.ok) {
      console.error("Checkout.com API Error:", parsedPayload);
      return res.status(request.status).send(parsedPayload);
    }

    res.status(request.status).send(parsedPayload);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Node server listening on port ${PORT}: ${BASE_URL}/`)
);
