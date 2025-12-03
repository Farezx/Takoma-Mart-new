import { Star } from "lucide-react";

export function renderStars(rating) {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={16}
      className={`${
        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
    />
  ));
}
