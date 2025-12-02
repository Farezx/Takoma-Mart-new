import { Mail } from "lucide-react";

export function NewsletterSection({ email, setEmail, handleNewsletterSubmit }) {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4 font-sora">
            Stay Fresh with Us
          </h2>
          <p className="text-xl text-green-100 font-inter">
            Get weekly deals, new arrivals, and fresh produce alerts
          </p>
        </div>

        <form
          onSubmit={handleNewsletterSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 font-inter"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 font-inter whitespace-nowrap"
          >
            Subscribe Now
          </button>
        </form>

        <p className="text-sm text-green-200 mt-4 font-inter">
          Join 5,000+ customers getting fresh deals. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
