import { useRef } from "react";
import { 
  motion, 
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring, 
  useTransform, 
  useVelocity, 
  wrap 
} from "framer-motion";

/** 
 * - TextCarousel Component
 * @param {object} props
 * @param {Array<string>} props.text - The array of text items to scroll.
 * @param {Array<number} props.colorIndex - The color index for the text.
 * @param {number} [props.baseVelocity=5] - The base velocity for scrolling.
 * @param {string} props.text - Font className
 * @returns {JSX.Element}
 */
const TextCarousel = ({ text = ["INSERT TEXT"], baseVelocity = 5, colorIndex = [1], font = "font-zentokyozoo" }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 250
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const directionFactor = useRef(1);

  const x = useTransform(baseX, (v) => `${wrap(-5, -55, v)}%`);
  // const x = 0;

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const getColorClass = (index) => {
    switch (index) {
      case 1:
        return "text-primary"; 
      case 2:
        return "text-secondary"; 
      case 3:
        return "text-tertiary"; 
      case 4:
        return "text-black"; 
      default:
        return "text-primary"; 
    }
  };

  return (
    <div className="ui-textcarousel-parallax flex">
      <motion.div className="ui-textcarousel-scroller" style={{ x }}>
        {/* overlap stuck prevention on viewport */}
        {[...Array(4)].map((_, i) => (
          text.map((item, j) => (
            <span
              key={`${i}-${j}`}
              className={`${
                getColorClass(colorIndex[j % colorIndex.length])
              } ${font}`}
            >
              {item}
              {" - "}
            </span>
          ))
        ))}
      </motion.div>
    </div>
  );
};

export default TextCarousel;
