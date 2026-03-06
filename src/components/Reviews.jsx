import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Star, ThumbsUp, Quote } from "lucide-react";

const reviews = [
  { id: 1, name: "John Kamau", location: "Nakuru, Kenya", rating: 5, date: "Feb 28, 2026", product: "Hybrid Maize Seeds", comment: "Excellent quality seeds! My harvest this season was the best I have ever had. Germination rate was almost 100% and the yield was outstanding. Highly recommend Chicago Agro!", avatar: "J", likes: 24 },
  { id: 2, name: "Mary Wanjiku", location: "Eldoret, Kenya", rating: 5, date: "Feb 20, 2026", product: "NPK Fertilizer", comment: "The NPK fertilizer transformed my farm completely. My crops are greener and healthier than ever before. Fast delivery and great customer service too!", avatar: "M", likes: 18 },
  { id: 3, name: "Peter Odhiambo", location: "Kisumu, Kenya", rating: 4, date: "Feb 15, 2026", product: "Irrigation Drip Kit", comment: "Very good drip irrigation system. Easy to install and saved me a lot of water. My vegetables are doing great. Will definitely order again!", avatar: "P", likes: 15 },
  { id: 4, name: "Grace Achieng", location: "Mombasa, Kenya", rating: 5, date: "Feb 10, 2026", product: "Cattle Feed Premium", comment: "My dairy cows have been producing more milk since I switched to this premium feed. The quality is top notch and the price is very fair!", avatar: "G", likes: 31 },
  { id: 5, name: "James Mwangi", location: "Nairobi, Kenya", rating: 5, date: "Feb 5, 2026", product: "Garden Tool Set", comment: "Best tool set I have ever bought. Very durable and comfortable to use. The carrying bag is a great bonus. Worth every penny!", avatar: "J", likes: 12 },
  { id: 6, name: "Faith Njeri", location: "Thika, Kenya", rating: 4, date: "Jan 30, 2026", product: "Organic Pesticide", comment: "Great organic pesticide that actually works! My crops are pest-free and I feel safe knowing it is eco-friendly. Will buy again.", avatar: "F", likes: 9 },
];

export default function Reviews() {
  const [liked, setLiked] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', product: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleLike = (id) => {
    if (!liked.includes(id)) {
      setLiked([...liked, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
    setNewReview({ name: '', product: '', rating: 5, comment: '' });
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of farmers across the region
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="text-6xl font-bold text-emerald-600">{avgRating}</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-500">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl mb-8 text-center font-medium">
            Thank you for your review! It will be published after verification.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">

              <Quote className="w-8 h-8 text-emerald-200 mb-4" />

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-4 text-sm">{review.comment}</p>

              <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                {review.product}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    liked.includes(review.id)
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-emerald-50'
                  }`}>
                  <ThumbsUp className="w-3 h-3" />
                  {review.likes + (liked.includes(review.id) ? 1 : 0)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
            Write a Review
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text" required
                    value={newReview.name}
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <input
                    type="text" required
                    value={newReview.product}
                    onChange={e => setNewReview({...newReview, product: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}>
                      <Star className={`w-8 h-8 transition-colors ${
                        star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <textarea
                  required rows={4}
                  value={newReview.comment}
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-4">
                <button type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors">
                  Submit Review
                </button>
                <button type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
