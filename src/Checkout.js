import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe
const stripePromise = loadStripe("your-publishable-key-here");

const Checkout = ({ cart }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch("https://ecommerce-site-l9ti.onrender.com/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: cart.reduce((sum, item) => sum + item.price, 0) })
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch(err => console.error("Error creating payment intent:", err));
    }, [cart]);

    return (
        <div className="container">
            <h2 className="text-center my-4">Checkout</h2>
            <form className="w-50 mx-auto">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>

                {/* Stripe Payment Form */}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripeCheckoutForm name={name} address={address} cart={cart} />
                    </Elements>
                )}
            </form>
        </div>
    );
};

// Stripe Checkout Form Component
const StripeCheckoutForm = ({ name, address, cart }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: { name, address }
            }
        });

        if (error) {
            console.error(error);
            alert("Payment failed!");
        } else {
            alert("Payment successful!");
            console.log("PaymentIntent:", paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Card Details</label>
                <CardElement className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={!stripe}>
                Pay Now
            </button>
        </form>
    );
};

export default Checkout;
