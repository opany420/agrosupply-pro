import React from 'react';
import { Star, Check, Trash2 } from "lucide-react";
import { formatDate } from '../../utils';

export default function ReviewsTab({
  pendingReviews, reviewsLoading, handleApproveReview, handleRejectReview,
}) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
        <p className="text-gray-500 text-sm">{pendingReviews.length} pending review{pendingReviews.length !== 1 ? 's' : ''}</p>
      </div>
      {reviewsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pendingReviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">✅ No pending reviews.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingReviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">{(review.name || '?')[0]}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs">{formatDate(review.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
              <div className="flex gap-2">
                <button onClick={() => handleApproveReview(review.id)}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleRejectReview(review.id)}
                  className="flex-1 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                  <Trash2 className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
