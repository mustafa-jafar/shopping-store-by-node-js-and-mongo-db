import Stripe from "stripe";

Stripe.setPublishablekey(
  pk_test_51HtGoAHjVS9QVhp125OsIisstGaHDEiN8UGF03JfafJbFNGank1z0ax2xHO2oyiaidzozEi7J1nHYjsM6TFypbwq00Avc9xqp8
);
var card = elements.create("card", {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#fff",
      color: "#fff",
      fontWeight: 400,
      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",

      "::placeholder": {
        color: "#BFAEF6"
      },
      ":-webkit-autofill": {
        color: "#fce883"
      }
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "#FFC7EE"
    }
  }
});
// crat amont
card.mount("#totalpircecart");


card.on('change', ({error}) => {
  let displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

var form = document.getElementById('checkout-form');

form.addEventListener('submit', function(ev) {
  ev.preventDefault();
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: 'Jenny Rosen'
      }
    }
  }).then(function(result) {
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
});

