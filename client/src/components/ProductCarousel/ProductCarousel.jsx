import { useState, useEffect } from "react";
import { Card } from "../../components";

const ProductCarousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto slide
  useEffect(() => {
    if (paused || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, images.length]);

  if (!images.length) return <p>No Images</p>;

  return (
    <Card
      className="p-4 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main Image */}
      <div className="relative h-96">
        <img
          src={images[current]?.url}
          alt="product"
          className="w-full h-full object-contain rounded-lg transition-all duration-500"
          loading="lazy"
        />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              current === index ? "bg-black scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center ">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            onClick={() => setCurrent(index)}
            className={`h-16 w-16 object-contain rounded-md cursor-pointer border-2 transition ${
              current === index
                ? "border-black scale-105"
                : "border-gray-200"
            }`}
            loading="lazy"
          />
        ))}
      </div>
    </Card>
  );
};

export default ProductCarousel;