import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, CheckCircle, Truck, CreditCard, User, MapPin, Phone, Mail, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", county: "",
    paymentMethod: "equity",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Build WhatsApp message
    const orderLines = cart.map(item =>
      `• ${item.name} x${item.quantity} = KES ${(item.price * item.quantity).toLocaleString()}`
    ).join("%0A");

    const message =
      `🛒 *NEW ORDER - Chicago Agro Supplies*%0A%0A` +
      `*Customer Details:*%0A` +
      `Name: ${formData.firstName} ${formData.lastName}%0A` +
      `Phone: ${formData.phone}%0A` +
      `Email: ${formData.email}%0A` +
      `Address: ${formData.address}, ${formData.city}, ${formData.county}%0A%0A` +
      `*Order Items:*%0A${orderLines}%0A%0A` +
      `*Total: KES ${totalPrice.toLocaleString()}*%0A` +
      `Payment: ${formData.paymentMethod === "equity" ? "Equity Paybill" : "Cash on Delivery"}`;

    // Open WhatsApp with order details (replace with client's number)
    window.open(`https://wa.me/254757790379?text=${message}`, "_blank");


    setOrderPlaced(true);
    clearCart();
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out</p>
          <Link to="/products">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 shadow-lg text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-2">Thank you, {formData.firstName}!</p>
          <p className="text-gray-500 mb-8">Our team will contact you shortly on <strong>{formData.phone}</strong> to confirm your delivery.</p>

          {formData.paymentMethod === "equity" && (
            <div className="bg-blue-50 rounded-xl p-5 mb-6 text-left border border-blue-100">
              <p className="font-bold text-blue-900 mb-3">💳 Complete Your Payment</p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>1. Go to <strong>Equity Bank App or USSD *247#</strong></p>
                <p>2. Select <strong>Pay Bill</strong></p>
                <p>3. Paybill Number: <strong>247247</strong></p>
                <p>4. Account Number: <strong>0790026955</strong></p>
                <p>5. Account Name: <strong>Chicago Agro Supplies Limited</strong></p>
                <p>6. Branch: <strong>Kakamega</strong></p>
                <p>7. Amount: <strong>KES {totalPrice.toLocaleString()}</strong></p>
              </div>
              <p className="text-blue-600 text-xs mt-3">📌 Send payment screenshot to our WhatsApp to confirm your order</p>
            </div>
          )}

          {formData.paymentMethod === "cod" && (
            <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
              <p className="font-semibold text-amber-900 mb-1">💵 Cash on Delivery</p>
              <p className="text-amber-700 text-sm">Have exact cash ready when our rider arrives. Delivery within Nairobi 1–3 business days.</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link to="/" className="flex-1">
              <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Go Home
              </button>
            </Link>
            <Link to="/products" className="flex-1">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Shop More
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center gap-2 text-emerald-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { num: 1, label: "Delivery Info", icon: User },
            { num: 2, label: "Payment", icon: CreditCard },
            { num: 3, label: "Review", icon: CheckCircle },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div className={"w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all " + (
                  step >= s.num ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                )}>
                  {s.num}
                </div>
                <span className={"font-medium text-sm hidden md:block " + (step >= s.num ? "text-emerald-600" : "text-gray-400")}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && <div className={"flex-1 h-1 rounded " + (step > s.num ? "bg-emerald-600" : "bg-gray-200")} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">

            {/* Step 1 - Delivery Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Delivery Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input name="firstName" required value={formData.firstName} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input name="lastName" required value={formData.lastName} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Kamau" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="email" type="email" required value={formData.email} onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="john@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="0712 345 678" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="address" required value={formData.address} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. Kenyatta Avenue, Westlands" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Town / City</label>
                      <input name="city" required value={formData.city} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Nairobi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                      <input name="county" required value={formData.county} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Nairobi County" />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (formData.firstName && formData.email && formData.phone && formData.address) setStep(2);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mt-4">
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: "equity", label: "🏦 Equity Paybill" },
                      { value: "cod", label: "💵 Cash on Delivery" },
                    ].map(method => (
                      <button key={method.value}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={"py-4 px-4 rounded-xl border-2 font-medium text-sm transition-all " + (
                          formData.paymentMethod === method.value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-600 hover:border-emerald-300"
                        )}>
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {formData.paymentMethod === "equity" && (
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <p className="font-bold text-blue-900 mb-3">💳 Equity Bank Paybill Details</p>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-500">Paybill Number</span>
                          <span className="font-bold">247247</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-500">Account Number</span>
                          <span className="font-bold">0790026955</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-500">Account Name</span>
                          <span className="font-bold">Chicago Agro Supplies Limited</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-500">Branch</span>
                          <span className="font-bold">Kakamega</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-500">Amount</span>
                          <span className="font-bold text-emerald-600">KES {totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-blue-600 text-xs mt-3">📌 After payment, send screenshot to our WhatsApp for quick confirmation</p>
                    </div>
                  )}

                  {formData.paymentMethod === "cod" && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="font-semibold text-amber-900 mb-1">💵 Cash on Delivery</p>
                      <p className="text-amber-700 text-sm">Have exact cash ready when our rider arrives. Available within Nairobi. Delivery in 1–3 business days.</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-4">
                    <button onClick={() => setStep(1)}
                      className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button onClick={() => setStep(3)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                      Review Order <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" /> Delivery Details
                    </h3>
                    <p className="text-gray-600 text-sm">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-600 text-sm">{formData.email}</p>
                    <p className="text-gray-600 text-sm">{formData.phone}</p>
                    <p className="text-gray-600 text-sm">{formData.address}, {formData.city}, {formData.county}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Method
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formData.paymentMethod === "equity" ? "🏦 Equity Paybill (247247 → Acc: 0790026955)" : "💵 Cash on Delivery"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" /> Delivery
                    </h3>
                    <p className="text-gray-600 text-sm">Free Delivery — 1–3 Business Days within Nairobi</p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100 flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm">Clicking <strong>Place Order</strong> will open WhatsApp so your order goes directly to our team for quick processing!</p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button onClick={handlePlaceOrder}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                    Place Order <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      <p className="text-emerald-600 font-bold text-sm">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
