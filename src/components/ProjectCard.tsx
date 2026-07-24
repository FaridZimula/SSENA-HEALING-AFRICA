import { useState, useEffect } from "react";

interface ProjectCardProps {
    title: string;
    description: string;
    images: string[];
    icon: string;
    category?: string; // Optional
    impact?: string;   // Optional
    layout?: "grid" | "list"; // To differentiate styling if needed
    showIcon?: boolean;
}

const getFaIconClass = (iconName: string) => {
    const map: Record<string, string> = {
        Target: "fa-solid fa-bullseye",
        Heart: "fa-solid fa-heart",
        Users: "fa-solid fa-users-gear",
        Briefcase: "fa-solid fa-briefcase",
        Leaf: "fa-solid fa-leaf",
        Star: "fa-solid fa-star",
        BookOpen: "fa-solid fa-book-open-reader",
        Zap: "fa-solid fa-bolt-lightning",
        Globe: "fa-solid fa-earth-africa",
        GraduationCap: "fa-solid fa-graduation-cap",
        Lightbulb: "fa-solid fa-lightbulb",
        Award: "fa-solid fa-award",
        ShieldCheck: "fa-solid fa-shield-halved",
        HandHeart: "fa-solid fa-hand-holding-heart",
        Shield: "fa-solid fa-shield-halved"
    };

    if (iconName?.startsWith("fa-")) {
        return `fa-solid ${iconName}`;
    }
    return map[iconName] || "fa-solid fa-bullseye";
};

const ProjectCard = ({ title, description, images, icon, showIcon = false }: ProjectCardProps & { variant?: "default" | "home" }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!images || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [images?.length]);

    const handleImageError = (index: number) => {
        setFailedImages((prev) => ({ ...prev, [index]: true }));
    };

    const iconClass = getFaIconClass(icon);
    const hasValidImages = images && images.length > 0;
    const currentImgFailed = failedImages[currentImageIndex];
    const allImagesFailed = hasValidImages && images.every((_, idx) => failedImages[idx]);

    return (
        <div data-aos="fade-up" className="w-[288px] max-w-[88vw] h-[495px] aspect-[288/495] bg-black text-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col border border-neutral-800 shrink-0 mx-auto">
            {/* Image Slideshow Area */}
            <div className="relative overflow-hidden w-full h-[250px] shrink-0 bg-neutral-900 flex items-center justify-center text-center">
                {hasValidImages && !allImagesFailed && (
                    images.map((img, index) => (
                        !failedImages[index] ? (
                            <img
                                key={index}
                                src={img}
                                alt={title}
                                onError={() => handleImageError(index)}
                                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                                    index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                                } transform duration-[4000ms]`}
                            />
                        ) : null
                    ))
                )}

                {/* Fallback display if an image is missing or fails to load */}
                {(!hasValidImages || allImagesFailed || currentImgFailed) && (
                    <div className="p-4 flex flex-col items-center justify-center text-center w-full h-full bg-gradient-to-br from-neutral-900 to-black text-white space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shadow-md mb-1 mx-auto">
                            <i className={`${iconClass} text-xl text-white`} />
                        </div>
                        <h4 className="font-bold text-base text-white max-w-[90%] leading-tight text-center break-words mx-auto px-2">
                            {title}
                        </h4>
                    </div>
                )}
            </div>

            {/* Content Area - Black Card with White Text */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow items-center justify-center text-center overflow-hidden">
                {showIcon && (
                    <div className="mb-3 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto shrink-0">
                        <i className={`${iconClass} text-white text-xl`} />
                    </div>
                )}

                <div className="w-full space-y-2 text-center flex flex-col items-center justify-center mx-auto overflow-hidden">
                    <h3 className="font-bold leading-tight text-center text-lg text-white max-w-full break-words mx-auto line-clamp-2">
                        {title}
                    </h3>
                    <p className="leading-relaxed text-center text-xs sm:text-sm text-neutral-300 max-w-full break-words mx-auto line-clamp-3">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
