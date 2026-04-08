import { Star } from "lucide-react";

interface Props {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const SIZES = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({ value, size = "md", showValue = false }: Props) {
  const filled = Math.floor(value);
  const half = value - filled >= 0.5;
  const className = SIZES[size];
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const isFilled = i < filled;
          const isHalf = !isFilled && i === filled && half;
          return (
            <Star
              key={i}
              className={`${className} ${
                isFilled || isHalf
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200"
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-900">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
