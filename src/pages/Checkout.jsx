import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CheckCircle, Truck, CreditCard, User, MapPin, Phone, Mail, ArrowLeft, ArrowRight } from "lucide-react";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
    paymentMethod: "card",
    cardNumber: "", cardExpiry: "", cardCvv: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h2>
          <p className="text-gray-500 mb-2">Thank you for your order!</p>
          <p className="text-gray-500 mb-8">We will contact you shortly to confirm your delivery details.</p>
          <div className="bg-emerald-50 rounded-xl p-4 mb-8">
            <p className="text-emerald-700 font-semibold">Order Confirmation</p>
            <p className="text-emerald-600 text-sm">A confirmation has been sent to {formData.email}</p>
          </div>
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
                        placeholder="Smith" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="email" type="email" required value={formData.email} onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="(312) 555-0000" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="address" required value={formData.address} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="123 Farm Road" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input name="city" required value={formData.city} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Chicago" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input name="state" required value={formData.state} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="IL" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input name="zip" required value={formData.zip} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="60601" />
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
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { value: "card", label: "Credit Card" },
                      { value: "bank", label: "Bank Transfer" },
                      { value: "cod", label: "Cash on Delivery" },
                    ].map(method => (
                      <button
                        key={method.value}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={"py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all " + (
                          formData.paymentMethod === method.value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-600 hover:border-emerald-300"
                        )}>
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input name="cardExpiry" value={formData.cardExpiry} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input name="cardCvv" value={formData.cardCvv} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="123" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "bank" && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Bank Transfer Details</p>
                      <p className="text-blue-700 text-sm">Bank: First National Bank</p>
                      <p className="text-blue-700 text-sm">Account Name: Chicago Agro Supplies Ltd</p>
                      <p className="text-blue-700 text-sm">Account Number: 0123456789</p>
                      <p className="text-blue-700 text-sm">Routing Number: 071000013</p>
                    </div>
                  )}

                  {formData.paymentMethod === "cod" && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="font-semibold text-amber-900 mb-1">Cash on Delivery</p>
                      <p className="text-amber-700 text-sm">Pay when your order arrives at your doorstep. Available for orders within Chicago only.</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-4">
                    <button onClick={() => setStep(1)}
                      className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button onClick={() => setStep(3)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                      Review Order
                      <ArrowRight className="w-5 h-5" />
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
                    <p className="text-gray-600 text-sm">{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Method
                    </h3>
                    <p className="text-gray-600 text-sm capitalize">{formData.paymentMethod === "cod" ? "Cash on Delivery" : formData.paymentMethod === "bank" ? "Bank Transfer" : "Credit Card"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" /> Delivery
                    </h3>
                    <p className="text-gray-600 text-sm">Free Delivery — 1-3 Business Days</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button onClick={handlePlaceOrder}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                    Place Order
                    <CheckCircle className="w-5 h-5" />
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
                      <p className="text-emerald-600 font-bold text-sm">KSh {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">KSh {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">KSh {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
