import { useState, useEffect, useRef } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

const CountUp = ({ end, duration = 2000, suffix = "", prefix = "", className = "" }: CountUpProps) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimatedRef.current) {
                    hasAnimatedRef.current = true;
                    startAnimation();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [end]);

    const startAnimation = () => {
        const step = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (ease-out-expo)
            const easeOut = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            };

            const currentCount = Math.floor(easeOut(percentage) * end);
            setCount(currentCount);

            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(step);
    };

    return (
        <span ref={elementRef} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};

export default CountUp;
