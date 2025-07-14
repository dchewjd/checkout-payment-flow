/* global CheckoutWebComponents */

// Handle form submission
document.getElementById('billing-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const billingData = {
    name: formData.get('name'),
    email: formData.get('email'),
    address1: formData.get('address1'),
    address2: formData.get('address2'),
    city: formData.get('city'),
    zip: formData.get('zip'),
    country: formData.get('country'),
    phone: formData.get('phone'),
    phoneCountry: formData.get('phone-country')
  };
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  try {
    // Create payment session with billing data
    const response = await fetch("/create-payment-sessions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billingData)
    });
    
    const paymentSession = await response.json();

    if (!response.ok) {
      console.error("Error creating payment session", paymentSession);
      alert('Error creating payment session. Please try again.');
      return;
    }

    // Hide billing form and show payment section
    document.querySelector('.billing-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
    
    // Initialize Checkout Web Components
    await initializeCheckout(paymentSession);
    
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Proceed to Payment';
  }
});

async function initializeCheckout(paymentSession) {
  // Insert your public key here
  const PUBLIC_KEY = "pk_sbox_bacht25cnxz4envroy5okvzequx";

  const checkout = await CheckoutWebComponents({
    publicKey: PUBLIC_KEY,
    environment: "sandbox",
    locale: "en-SG",
    paymentSession,
    onReady: () => {
      console.log("onReady");
    },
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log("Create Payment with PaymentId: ", paymentResponse.id);
      
      // Display payment success message with payment ID
      document.getElementById('flow-container').style.display = 'none';
      document.getElementById('successful-payment-message').innerHTML = `
        <div class="success-message">
          <h3>✅ Payment Successful!</h3>
          <p><strong>Payment ID:</strong> ${paymentResponse.id}</p>
          <p>Thank you for your purchase!</p>
        </div>
      `;
    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${component.isValid()}" for "${
          component.type
        }"`,
      );
    },
    onError: (component, error) => {
      console.log("onError", error, "Component", component.type);
    },
  });

  const flowComponent = checkout.create("flow");
  flowComponent.mount(document.getElementById("flow-container"));
}

function triggerToast(id) {
  var element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");
}

if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}
