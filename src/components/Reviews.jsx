import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Star, ThumbsUp, Quote } from "lucide-react";
import { supabase } from '../supabase';
import { formatDate } from '../utils';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', location: '', product: '', rating: 5, comment: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleLike = async (id, currentLikes) => {
    if (liked.includes(id)) return;
    setLiked([...liked, id]);
    await supabase.from('reviews').update({ likes: currentLikes + 1 }).eq('id', id);
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: currentLikes + 1 } : r));
  };

  const handleSubmit = async () => {
    if (!newReview.name || !newReview.product || !newReview.comment) return;
    setSubmitting(true);
    const avatar = newReview.name.trim()[0].toUpperCase();
    const location = newReview.location.trim() || 'Kenya';
    const { data } = await supabase.from('reviews').insert([{
      name: newReview.name,
      location,
      rating: newReview.rating,
      product: newReview.product,
      comment: newReview.comment,
      avatar,
      likes: 0,
      approved: true,
    }]).select().single();
    if (data) setReviews([data, ...reviews]);
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setNewReview({ name: '', location: '', product: '', rating: 5, comment: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Trusted by thousands of farmers across the region</p>
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
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl mb-8 text-center font-medium">
            ✅ Thank you! Your review has been published successfully.
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, idx) => (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.07 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <Quote className="w-8 h-8 text-emerald-200 mb-4" />
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">{review.comment}</p>
                <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                  {review.product}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.avatar || review.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-gray-400 text-xs">{review.location} · {formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleLike(review.id, review.likes)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      liked.includes(review.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500 hover:bg-emerald-50'
                    }`}>
                    <ThumbsUp className="w-3 h-3" />
                    {review.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write Your Review</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={newReview.name}
                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. John Kamau" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={newReview.location}
                    onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Kisumu, Kenya" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <input type="text" value={newReview.product}
                  onChange={e => setNewReview({ ...newReview, product: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Hybrid Maize Seeds" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })}>
                      <Star className={`w-8 h-8 transition-colors ${star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="text-gray-500 text-sm ml-2">{newReview.rating} star{newReview.rating > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea rows={4} value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Share your experience with this product..." />
              </div>
              <div className="flex gap-4">
                <button onClick={handleSubmit} disabled={submitting || !newReview.name || !newReview.product || !newReview.comment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    : 'Submit Review'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
