import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

function Orders() {
  const url = "http://localhost:4000";
  const [orders, setOrders] = useState([]);

  const ordersList = async () => {
    try {
      const response = await axios.get(`${url}/api/order/all`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Request failed", error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await axios.delete(`${url}/api/order/delete/${orderId}`);
      if (response.data.success) {
        toast.success("Order deleted successfully");
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error deleting order", error);
    }
  };

  useEffect(() => {
    ordersList();
  }, []);

  const csvHeaders = [
    { label: "Order ID", key: "_id" },
    { label: "User ID", key: "userId" },
    { label: "Amount", key: "amount" },
    { label: "Street", key: "address.street" },
    { label: "City", key: "address.city" },
    { label: "Pincode", key: "address.pincode" },
    { label: "Phone", key: "address.phone" },
    { label: "Razorpay Order", key: "razorpayOrderId" },
    { label: "Status", key: "status" },
    { label: "Payment", key: "payment" },
    { label: "Date", key: "date" },
  ];

  const formattedCSVData = orders.map((order) => ({
    _id: order._id,
    userId: order.userId,
    amount: order.amount,
    "address.street": order.address?.street || "N/A",
    "address.city": order.address?.city || "N/A",
    "address.pincode": order.address?.pincode || "N/A",
    "address.phone": order.address?.phone || "N/A",
    razorpayOrderId: order.razorpayOrderId || "N/A",
    status: order.status || "N/A",
    payment: order.payment ? "Paid" : "Unpaid",
    date: new Date(order.date).toLocaleString(),
  }));

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-title">All Orders</h2>
        <CSVLink
          data={formattedCSVData}
          headers={csvHeaders}
          filename={"orders.csv"}
          className="export-btn"
        >
          Export CSV
        </CSVLink>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Street</th>
              <th>City</th>
              <th>Pincode</th>
              <th>Phone</th>
              <th>Razorpay Order</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.userId}</td>
                <td>
                  {order.items.length === 0
                    ? "No Items"
                    : order.items.map((item, idx) => (
                        <div key={idx}>
                          {Object.entries(item).map(([productId, quantity]) => (
                            <div key={productId}>
                              {productId}: {quantity}
                            </div>
                          ))}
                        </div>
                      ))}
                </td>
                <td>{order.amount}</td>
                <td>{order.address?.street || "N/A"}</td>
                <td>{order.address?.city || "N/A"}</td>
                <td>{order.address?.pincode || "N/A"}</td>
                <td>{order.address?.phone || "N/A"}</td>
                <td>{order.razorpayOrderId || "N/A"}</td>
                <td className={`status ${order.status?.toLowerCase()}`}>
                  {order.status || "N/A"}
                </td>
                <td>{order.payment ? "Paid" : "Unpaid"}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
