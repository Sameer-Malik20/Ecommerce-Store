import React, { useState, useEffect } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1615615228002-890bb61cac6e?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nike React",
    subtitle: "Rewriting sport's playbook for billions of athletes",
    button: "Read Case Studies",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523191665038-d75548b1a52a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "CoolApps",
    subtitle: "From mobile apps to gaming consoles",
    button: "Read Case Studies",
  },
  {
    image:
      "https://images.unsplash.com/photo-1690952945176-e95a625f8548?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Grumpy",
    subtitle: "Bringing Art to everything",
    button: "Read Case Studies",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setFade(true);
      }, 200);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div
        className="relative overflow-hidden w-full h-96 md:h-[calc(100vh-106px)] bg-gray-100 rounded-2xl dark:bg-neutral-800 flex items-end bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${slides[current].image}')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
        {/* Content */}
        <div className="relative z-10 mt-auto w-2/3 md:max-w-lg ps-5 pb-5 md:ps-10 md:pb-10">
          <span className="block text-white">{slides[current].title}</span>
          <span className="block text-white text-xl md:text-3xl font-bold">
            {slides[current].subtitle}
          </span>
          <div className="mt-5">
            <a
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-transparent text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              href="#"
            >
              {slides[current].button}
            </a>
          </div>
        </div>
        {/* Arrows removed */}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
