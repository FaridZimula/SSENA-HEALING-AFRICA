import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

const highlightsData = [
  {
    id: "highlight-1",
    title: "Protect My Dignity: Buy a Pad for a Vulnerable Girl",
    description:
      "Join SSENA Healing Africa on August 14th, 2026 at Tubeyi Primary School, Bukhiende Sub County, Mbale District for our 'Protect My Dignity' charity project. We aim to reach 250 vulnerable girls by providing reusable pad donations, menstrual hygiene education, and mental health awareness. At just 10,000 UGX per pack, you can help us make periods friendly, fight stigma, and restore dignity to young girls. Be the reason! #KISOBOKA",
    images: [
      "/PROTECT_MY_DIGNITY.jpg"
    ],
    tags: ["Menstrual Hygiene", "Pad Donation", "Mbale District", "Mental Health"],
    link: "/donate"
  },
  {
    id: "highlight-2",
    title: "Rotaract District 9213 Appreciation Recognition",
    description:
      "DRR Alex Muwanguzi of Rotaract District 9213 presented our Director with an appreciation banner recognizing our organization's transformative work in empowering communities. To us, this is not just a banner—it is a powerful symbol that our vision and purpose are coming to life. Together, we impact more.",
    images: [
      "/DRR_1.jpg",
      "/DRR_2.jpg"
    ],
    tags: ["Rotaract D9213", "Recognition", "Community Impact"],
    link: "/projects"
  },
  {
    id: "highlight-3",
    title: "Happy Birthday to Our Treasurer, Ms. Nakyewa Juliet!",
    description:
      "We send warm birthday wishes to our dedicated Treasurer, Ms. Nakyewa Juliet! We deeply appreciate and acknowledge her outstanding efforts, leadership, and invaluable commitment towards the growth of SSENA Healing Africa. May you live a long, blessed life as you continue serving our community with passion.",
    images: [
      "/BIRTHDAY.webp"
    ],
    tags: ["Birthday Celebration", "Giving Back", "Community Joy", "Youth Empowerment"],
    link: "/projects"
  }
];

const HighlightCardImageSlider = ({ images, title }: { images: string[]; title: string }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % Math.min(images.length, 12));
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  const displayImages = (images || []).slice(0, 12);

  return (
    <div className="lg:col-span-5 relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-lg bg-secondary group">
      {displayImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${title} - photo ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            index === activeImgIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Small dot indicators if card has multiple photos (up to 12) */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center items-center gap-1.5 px-2">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImgIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeImgIndex === idx ? "w-5 bg-white shadow-md" : "w-1.5 bg-white/60 hover:bg-white"
              }`}
              aria-label={`View photo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HighlightCard = ({ highlight }: { highlight: typeof highlightsData[0] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="w-[88vw] max-w-[750px] lg:max-w-[850px] flex-shrink-0 snap-center bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-all duration-300"
    >
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Side: Multi-image slideshow (accommodates 1080x1080 photos & up to 12 images) */}
        <HighlightCardImageSlider images={highlight.images} title={highlight.title} />

        {/* Right Side: Content Text */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight">
            {highlight.title}
          </h3>

          <p className={`text-muted-foreground text-sm sm:text-base leading-relaxed ${!isExpanded ? "line-clamp-4" : ""}`}>
            {highlight.description}
          </p>

          {/* Action Button */}
          <div className="pt-2 flex justify-start">
            <Button
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white"
            >
              {isExpanded ? "Show Less" : "Read More"}
              <ArrowRight className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${isExpanded ? "-rotate-90" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / highlightsData.length;
      scrollRef.current.scrollTo({ left: cardWidth * index, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.scrollWidth / highlightsData.length;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex >= 0 && newIndex < highlightsData.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-background w-full max-w-full overflow-hidden">
      <div className="container-narrow mx-auto w-full max-w-full overflow-hidden">
        {/* Section Header */}
        <div data-aos="fade-up" className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4 text-center">
            Our Latest Highlights & Updates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl text-center">
            Stay updated with our latest activities, key milestones, and ongoing community initiatives.
          </p>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scrollbar-none scroll-smooth px-1"
        >
          {highlightsData.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {highlightsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
