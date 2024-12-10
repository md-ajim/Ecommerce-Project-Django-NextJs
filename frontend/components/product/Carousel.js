import { useState, useEffect } from "react";

const images = [
  "https://images.pexels.com/photos/7505175/pexels-photo-7505175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with your image paths
  'https://images.pexels.com/photos/7505175/pexels-photo-7505175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/7505175/pexels-photo-7505175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  "https://images.pexels.com/photos/7505175/pexels-photo-7505175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 

];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);


  // Automatically change slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <div
        className="carousel-inner   rounded-2xl h-[325px] md:h-[650px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div className="carousel-item" key={index}>
            <img className=" rounded-2xl" src={src} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          > </button>
        ))}
      </div>
    </div>
  );
}
