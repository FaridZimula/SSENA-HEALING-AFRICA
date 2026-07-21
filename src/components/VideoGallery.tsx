import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

const highlightsData = [
  {
    id: "highlight-1",
    title: "Youth Empowerment & Innovation Summit",
    description:
      "Get ready for our groundbreaking community development initiatives! SSENA Healing Africa invites young leaders, innovators, and students to participate in dedicated mentorship, vocational skills training, and inclusive community support programs across Uganda. We are committed to fostering self-reliance, leadership, and sustainable community growth.",
    images: [
      "/LeadershipTraining1.jpg",
      "/LeadershipTraining2.jpg",
      "/LeadershipTraining3.jpg",
      "/Leadership programme 2.jpeg",
      "/Leadership Skills Training.jpeg"
    ],
    tags: ["Youth Mentorship", "Community Healthcare", "Skill Building"],
    link: "/projects"
  },
  {
    id: "highlight-2",
    title: "Ishaka Hospital Maternity & Health Support",
    description:
      "Conducting dedicated health outreach to young mothers and families. Providing essential healthcare kits, hygiene supplies, and personal mentorship to support young mothers in continuing their education and pursuing their career aspirations.",
    images: [
      "/Ishaka 1.jpg",
      "/Ishaka 2.jpg",
      "/Ishaka 3.jpg",
      "/Ishaka 4.jpg"
    ],
    tags: ["Health Support", "Young Mothers", "Maternity Kits"],
    link: "/projects"
  },
  {
    id: "highlight-3",
    title: "Digital Literacy & Future Economy Workshop",
    description:
      "Collaborating with tech leaders and Google Cloud Developers to host hands-on workshops in AI, Robotics, and digital skills, equipping Ugandan youth to excel in a rapidly evolving technological landscape.",
    images: [
      "/IT 1.jpeg",
      "/IT2.jpeg",
      "/IT3.jpeg"
    ],
    tags: ["AI Workshops", "Robotics", "Digital Skills"],
    link: "/projects"
  },
  {
    id: "highlight-4",
    title: "Community Outreach & Sustainable Clean Environment",
    description:
      "Mobilizing youth leaders and community members for market cleanups and environmental awareness in Ishaka-Bassaja market, promoting sanitation and community responsibility.",
    images: [
      "/Cleanup1.jpg",
      "/Cleanup2.jpg",
      "/Cleanup3.jpg",
      "/Cleanup4.jpg",
      "/Cleanup5.jpg"
    ],
    tags: ["Clean Environment", "Community Action", "Sanitation"],
    link: "/projects"
  },
  {
    id: "highlight-5",
    title: "National University Leadership Training",
    description:
      "Providing intensive leadership skills development for student representatives from universities across Uganda in partnership with Balunywa Leadership Academy.",
    images: [
      "/BasogaNssete1.jpg",
      "/BasogaNssete2.jpg",
      "/BasogaNssete3.jpg"
    ],
    tags: ["University Leaders", "Leadership Training", "Youth Empowerment"],
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
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-background">
      <div className="container-narrow mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up" className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4 text-center">
            Our Latest Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl text-center">
            See the impact of our programs and hear directly from the youth we empower.
          </p>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scrollbar-none scroll-smooth px-1"
        >
          {highlightsData.map((highlight) => (
            <div
              key={highlight.id}
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

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-4">
                    {highlight.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {highlight.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-lg text-xs font-semibold text-foreground border border-border"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex justify-start">
                    <Button asChild size="sm" className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white">
                      <Link to={highlight.link}>
                        Explore Highlight
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
