import { Quote, Heart, CheckCircle } from "lucide-react";
import { renderStars } from "@/utils/renderStars";

export function ReviewsSection({ reviews }) {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sora">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 font-inter">
            Real reviews from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold font-sora text-lg">
                  {review.first_name?.[0] || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 font-inter">
                      {review.first_name} {review.last_name?.[0]}.
                    </h4>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-gray-500 font-inter">
                    Verified Purchase • {review.product_name}
                  </p>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-green-200 mb-2" />
                <h5 className="font-semibold text-gray-900 mb-2 font-inter">
                  {review.title}
                </h5>
                <p className="text-gray-700 font-inter leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-inter">
                  <Heart className="w-4 h-4" />
                  <span>{review.helpful_count} found helpful</span>
                </div>
                <span className="text-xs text-gray-400 font-inter">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-gray-900 font-sora">
              4.9
            </div>
            <div className="flex justify-center space-x-1 my-2">
              {renderStars(5)}
            </div>
            <div className="text-sm text-gray-600 font-inter">
              Average Rating
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-gray-900 font-sora">
              2.1k+
            </div>
            <div className="text-sm text-gray-600 font-inter">
              Happy Reviews
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-gray-900 font-sora">
              98%
            </div>
            <div className="text-sm text-gray-600 font-inter">
              Repeat Customers
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-gray-900 font-sora">5★</div>
            <div className="text-sm text-gray-600 font-inter">Most Reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}
