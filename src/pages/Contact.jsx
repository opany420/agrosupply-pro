import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
import { COMPANY, PAYMENT, WHATSAPP } from '../constants';

const contactInfo = [
  { icon: MapPin, title: "Visit Us", details: [COMPANY.address, COMPANY.location], color: "bg-blue-100 text-blue-600" },
  { icon: Phone, title: "Call Us", details: [COMPANY.phone, COMPANY.workingHours], color: "bg-emerald-100 text-emerald-600" },
  { icon: Mail, title: "Email Us", details: [COMPANY.email], color: "bg-purple-100 text-purple-600" },
  { icon: Clock, title: "Working Hours", details: [COMPANY.workingHours], color: "bg-amber-100 text-amber-600" },
];

const faqs = [
  { q: "Do you offer bulk discounts?", a: "Yes! Orders over KES 50,000 get 10% off. Contact us for custom pricing." },
  { q: "What is your delivery time?", a: "1–2 days within Kisumu, 2–4 days upcountry Kenya." },
  { q: "How do I pay?", a: `We accept Equity Paybill ${PAYMENT.paybillNumber}, Account ${PAYMENT.accountNumber} (${PAYMENT.accountName}, ${PAYMENT.branch} Branch) and Cash on Delivery.` },
  { q: "Do you offer credit accounts?", a: "Yes, for qualified businesses. Contact us to apply." },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send message via WhatsApp
    const msg =
      `📩 *New Inquiry - Chicago Agro Supplies*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Subject:* ${formData.subject}%0A%0A` +
      `*Message:*%0A${formData.message}`;

    window.open(`${WHATSAPP.baseUrl}?text=${encodeURIComponent(msg)}`, "_blank");

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have questions? Our team of agricultural experts is here to help you
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center">
                <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{info.title}</h3>
                {info.details.map((d, i) => (
                  <p key={i} className="text-gray-500 text-sm">{d}</p>
                ))}
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 mb-8">We'll get back to you via WhatsApp within a few hours</p>

              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-700 font-medium">Message sent to our WhatsApp!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" required value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="John Kamau" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0712 345 678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select required value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select Subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Delivery Issue">Delivery Issue</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Payment">Payment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Tell us how we can help you..." />
                </div>

                <button type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  Send via WhatsApp
                </button>
              </form>
            </motion.div>

            {/* Map + FAQ */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Us Here</h2>
              <p className="text-gray-500 mb-8">Visit our office and warehouse in Ahero, Kisumu</p>

              {/* Google Map Embed - Ahero, Kisumu */}
              <div className="rounded-2xl overflow-hidden shadow-lg h-64 mb-8 border border-gray-100">
                <iframe
  title="Chicago Agro Supplies Location"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
  allowFullScreen
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.4!2d34.9197!3d-0.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182aa3b0b0b0b0b0%3A0x0!2sAhero%2C+Kisumu%2C+Kenya!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske">
</iframe>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-6">
                <p className="font-bold text-blue-900 mb-3">💳 Payment Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-semibold text-gray-800">Equity Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paybill</span>
                    <span className="font-semibold text-gray-800">{PAYMENT.paybillNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account No.</span>
                    <span className="font-semibold text-gray-800">{PAYMENT.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Name</span>
                    <span className="font-semibold text-gray-800">{PAYMENT.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Branch</span>
                    <span className="font-semibold text-gray-800">{PAYMENT.branch}</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Quick FAQ</h3>
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900 mb-1">{faq.q}</p>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
