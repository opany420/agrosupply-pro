import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  { icon: MapPin, title: "Visit Us", details: ["123 Agricultural Blvd", "Chicago, IL 60601"], color: "bg-blue-100 text-blue-600" },
  { icon: Phone, title: "Call Us", details: ["(312) 555-AGRO", "(312) 555-2476"], color: "bg-emerald-100 text-emerald-600" },
  { icon: Mail, title: "Email Us", details: ["info@chicagoagro.com", "support@chicagoagro.com"], color: "bg-purple-100 text-purple-600" },
  { icon: Clock, title: "Working Hours", details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 4PM"], color: "bg-amber-100 text-amber-600" },
];

const faqs = [
  { q: "Do you offer bulk discounts?", a: "Yes! Orders over $500 get 10% off." },
  { q: "What is your delivery time?", a: "1-2 days Chicago, 3-5 days Midwest." },
  { q: "Do you offer credit accounts?", a: "Yes, for qualified businesses." },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20">

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

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 mb-8">We will get back to you within 24 hours</p>

              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-700 font-medium">Message sent successfully!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" required value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="John Smith" />
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
                      placeholder="(312) 555-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select required value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select Subject</option>
                      <option value="products">Product Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="other">Other</option>
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
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Us Here</h2>
              <p className="text-gray-500 mb-8">Visit our main office and warehouse</p>

              <div className="rounded-2xl overflow-hidden shadow-lg h-64 bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-8">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 text-xl mb-2">123 Agricultural Blvd</h3>
                  <p className="text-gray-500">Chicago, IL 60601</p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                    className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Open in Google Maps
                  </a>
                </div>
              </div>

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