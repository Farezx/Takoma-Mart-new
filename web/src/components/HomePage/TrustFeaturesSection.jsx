import { Truck, Shield, Heart } from "lucide-react";

export function TrustFeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "15-Minute Pickup",
      desc: "Order ahead, pickup fresh groceries in just 15 minutes",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      desc: "100% satisfaction guarantee on all premium products",
    },
    {
      icon: Heart,
      title: "Local Partners",
      desc: "Supporting local farmers and artisan producers",
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sora">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-inter">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
