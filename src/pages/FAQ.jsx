import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY, PAYMENT, WHATSAPP } from '../constants';

const faqs = [
  { category: "Orders", question: "How do I place an order?", answer: `You can place an order directly on our website by adding products to your cart and proceeding to checkout. You can also call us at ${COMPANY.phone} or send us a WhatsApp message and our team will assist you.` },
  { category: "Orders", question: "Can I modify or cancel my order?", answer: `Yes, you can modify or cancel your order within 2 hours of placing it. After that, the order may already be processed for delivery. Contact us immediately via WhatsApp ${COMPANY.phone}.` },
  { category: "Orders", question: "Do you offer bulk order discounts?", answer: "Yes! We offer attractive discounts for bulk orders. Orders above KES 50,000 get 10% off, orders above KES 100,000 get 15% off, and orders above KES 500,000 get 20% off. Contact our sales team for custom pricing." },
  { category: "Delivery", question: "How long does delivery take?", answer: "Delivery times depend on your location. Within Kisumu and Ahero: same day or next day. Major towns in Western Kenya: 1–2 business days. Rest of Kenya: 2–4 business days. Express delivery available at extra cost." },
  { category: "Delivery", question: "How much does delivery cost?", answer: "We offer free delivery on orders above KES 2,000. For orders below KES 2,000, delivery charges are KES 150 within Ahero/Kisumu, KES 250 for major towns, and KES 400 for the rest of Kenya." },
  { category: "Delivery", question: "Do you deliver to rural areas?", answer: "Yes! We deliver to rural and remote farming areas across Kenya. Delivery times may be longer and additional charges may apply. Contact us with your location for a specific quote." },
  { category: "Products", question: "Are your products certified and authentic?", answer: "Yes, all our products are 100% authentic and certified. We source directly from licensed manufacturers and research institutions. Every product comes with its original certification and quality guarantee." },
  { category: "Products", question: "Do you offer product recommendations?", answer: "Absolutely! Our team of agricultural experts can recommend the best products for your specific crops, soil type, and farming goals. Contact us via WhatsApp or phone and we will guide you." },
  { category: "Products", question: "What if a product does not work as expected?", answer: "We stand behind every product we sell. If a product does not meet your expectations, contact us within 30 days and we will either replace it or give you a full refund. Your satisfaction is guaranteed." },
  { category: "Payment", question: "What payment methods do you accept?", answer: `We accept Equity Bank Paybill ${PAYMENT.paybillNumber} (Account: ${PAYMENT.accountNumber}, ${PAYMENT.accountName}, ${PAYMENT.branch} Branch) and Cash on Delivery for local orders. Credit accounts available for qualified businesses.` },
  { category: "Payment", question: "How do I pay via Equity Paybill?", answer: `Go to Equity Bank App or dial *247#. Select Pay Bill, enter Paybill Number ${PAYMENT.paybillNumber}, Account Number ${PAYMENT.accountNumber}, Account Name: ${PAYMENT.accountName}, Branch: ${PAYMENT.branch}, then enter your amount and confirm.` },
  { category: "Payment", question: "Do you offer credit or payment plans?", answer: "Yes, we offer credit accounts and flexible payment plans for qualified businesses and farms. Contact our team to discuss options. A credit application and business verification may be required." },
  { category: "Returns", question: "What is your return policy?", answer: "We accept returns within 30 days of purchase for unopened products in their original condition. For products that have been opened but are defective, we offer a full replacement. Seeds have a 7-day return window." },
  { category: "Returns", question: "How do I initiate a return?", answer: `To initiate a return, contact us via WhatsApp ${COMPANY.phone}. Provide your order details and reason for return. We will arrange pickup or guide you on how to send the product back.` },
];

const categories = ["All", "Orders", "Delivery", "Products", "Payment", "Returns"];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(faq => {
    const matchCat = activeCategory === "All" || faq.category === activeCategory;
    const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-emerald-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-white/80 mb-8">Find answers to common questions about our products and services</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search questions..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={"px-5 py-2 rounded-full font-medium text-sm transition-all " + (
                  activeCategory === cat ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-emerald-50"
                )}>
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenId(openId === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {openId === idx ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openId === idx && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try a different search term or category</p>
            </div>
          )}

          <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our team is ready to help you with any questions you may have</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Contact Us
                </button>
              </Link>
              <a href={WHATSAPP.baseUrl} target="_blank" rel="noreferrer">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  💬 WhatsApp Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
