import React, { useContext, useState } from "react";
import "./Placeorder.css";
import { StoreContext } from "../../components/context/StoreContext";

function Placeorder() {
  const { getTotalCartAmount, cartItems } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const orderData = {
      userId: "6891c9f677752ac1e9117bf3", // Dummy for now
      items: cartItems,
      amount: getTotalCartAmount() + 2,
      address: {
        street: formData.street,
        city: formData.city,
        pincode: formData.zipCode,
        phone: formData.contact,
      },
    };

    try {
      const response = await fetch("https://food-del-backend-kryb.onrender.com/api/order/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Order creation failed: " + data.message);
        return;
      }

      const { order, dbOrderId } = data;

      const options = {
        key: "rzp_test_ntcG28Y8NzLlaE",
        amount: order.amount,
        currency: order.currency,
        name: "HungryHub",
        description: "Food Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("https://food-del-backend-kryb.onrender.com/api/order/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment successful & Order confirmed!");
              window.location.href = "/my-orders"; // optional
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment verify error", err);
            alert("Payment verification failed (server error).");
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.contact,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <form className="place-order" onSubmit={handlePayment}>
      <div className="place-order-left">
        <p className="tittle">Place Order Information</p>
        <div className="multiFields">
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        </div>
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
        <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
        <div className="multiFields">
          <input type="text" name="city" placeholder="City" onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" onChange={handleChange} required />
        </div>
        <div className="multiFields">
          <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
        </div>
        <input type="text" name="contact" placeholder="Contact No" onChange={handleChange} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
          </div>
          <button type="submit">Proceed To Payment</button>
        </div>
      </div>
    </form>
  );
}

export default Placeorder;
