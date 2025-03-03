import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useAnimationControls } from 'framer-motion';
import gsap from 'gsap';

// Take separating from ../ui/Logo.jsx cause of properties of <svg>

const RemakeLogo = ({
  x = "0",
  y = "0",
  width = "120",
  height = "46",
  color = "black",
  textAnchor = "",
  transform = "",
  repeatDelay = 0.35,
  mask = ""
}) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const animateSequence = async () => {
      await controls.start("hidden");
      await new Promise(resolve => setTimeout(resolve, 300));
      await controls.start("visible");
      // Wait before repeating
      setTimeout(animateSequence, repeatDelay * 1000);
    };

    animateSequence();
    
  }, [controls, repeatDelay]);
  
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.06,
        delayChildren: 0.2,
        duration: 0.8
      },
    },
  };

  // Child variants with spring effect
  const childVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
  };

  // stggered letter
  const letterPaths = [
    <motion.path 
      key="j"
      d="M62.845 93.408C62.845 99.832 61.613 104.892 59.1489 108.588C56.773 112.196 53.385 114.308 48.9849 114.924L47.2689 110.04C48.6769 109.512 49.8649 108.808 50.8329 107.928C51.8889 106.96 52.7249 105.816 53.3409 104.496C54.0449 103.088 54.529 101.504 54.7929 99.744C55.145 97.984 55.321 96.004 55.321 93.804V73.608C53.649 75.456 51.493 76.996 48.853 78.228C46.213 79.372 43.397 80.252 40.4049 80.868C37.4129 81.396 34.5089 81.66 31.6929 81.66C25.7969 81.66 20.7809 80.516 16.6449 78.228C12.5969 75.94 9.51695 72.728 7.40495 68.592C5.29295 64.456 4.23695 59.572 4.23695 53.94V21.6H11.6289V54.204C11.6289 58.692 12.4649 62.432 14.1369 65.424C15.8969 68.416 18.4049 70.66 21.6609 72.156C24.9169 73.652 28.7889 74.4 33.2769 74.4C35.8289 74.4 38.3809 74.136 40.933 73.608C43.573 72.992 45.949 72.068 48.0609 70.836C50.2609 69.604 52.0209 67.932 53.3409 65.82C54.6609 63.708 55.321 61.156 55.321 58.164V21.6H62.845V93.408Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    <motion.path 
      key="i"
      d="M112.786 67.8C112.786 64.544 112.214 61.904 111.07 59.88C110.014 57.856 108.518 56.316 106.582 55.26C104.734 54.204 102.578 53.5 100.114 53.148C97.6503 52.708 95.0983 52.488 92.4583 52.488L92.7223 46.812C98.0903 46.812 102.534 47.34 106.054 48.396C109.574 49.364 112.346 50.992 114.37 53.28C116.482 55.48 117.978 58.472 118.858 62.256C119.738 65.952 120.178 70.528 120.178 75.984V114C120.266 114 119.782 114.044 118.726 114.132C117.758 114.22 116.438 114.308 114.766 114.396C113.182 114.572 111.422 114.704 109.486 114.792C107.638 114.968 105.79 115.1 103.942 115.188C102.182 115.276 100.642 115.32 99.3223 115.32C95.0983 115.408 91.1383 115.144 87.4423 114.528C83.8343 113.912 80.6663 112.768 77.9383 111.096C75.2983 109.336 73.1863 106.872 71.6023 103.704C70.1063 100.536 69.3583 96.532 69.3583 91.692V80.736C69.3583 77.04 69.8863 73.916 70.9423 71.364C72.0863 68.812 73.6263 66.788 75.5623 65.292C77.4983 63.708 79.6543 62.564 82.0303 61.86C84.4943 61.156 87.0463 60.804 89.6863 60.804C92.5903 60.804 95.4063 61.156 98.1343 61.86C100.862 62.476 103.458 63.312 105.922 64.368C108.474 65.424 110.762 66.568 112.786 67.8ZM112.786 74.004C110.498 72.772 108.034 71.628 105.394 70.572C102.754 69.516 100.07 68.68 97.3423 68.064C94.6143 67.448 91.8423 67.14 89.0263 67.14C87.8823 67.14 86.6063 67.316 85.1983 67.668C83.7903 68.02 82.4263 68.68 81.1063 69.648C79.7863 70.528 78.6863 71.892 77.8063 73.74C77.0143 75.588 76.6183 78.008 76.6183 81V90.768C76.6183 93.936 76.9263 96.708 77.5423 99.084C78.2463 101.46 79.3903 103.44 80.9743 105.024C82.6463 106.52 84.9343 107.62 87.8383 108.324C90.7423 108.94 94.3943 109.16 98.7943 108.984C100.554 108.896 102.138 108.808 103.546 108.72C105.042 108.632 106.362 108.544 107.506 108.456C108.65 108.28 109.618 108.192 110.41 108.192C111.202 108.104 111.774 108.06 112.126 108.06C112.566 107.972 112.786 107.928 112.786 107.928V74.004Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    <motion.path 
      key="t"
      d="M177.587 114C177.675 114 177.191 114.044 176.135 114.132C175.167 114.22 173.847 114.308 172.175 114.396C170.591 114.572 168.831 114.704 166.895 114.792C165.047 114.968 163.243 115.1 161.483 115.188C159.723 115.276 158.227 115.32 156.995 115.32C152.771 115.408 148.811 115.144 145.115 114.528C141.419 113.912 138.207 112.768 135.479 111.096C132.751 109.336 130.595 106.872 129.011 103.704C127.515 100.536 126.767 96.532 126.767 91.692V66.612C126.767 62.916 127.383 59.792 128.615 57.24C129.935 54.688 131.651 52.664 133.763 51.168C135.963 49.584 138.339 48.44 140.891 47.736C143.531 47.032 146.171 46.68 148.811 46.68C153.123 46.68 157.039 47.164 160.559 48.132C164.079 49.1 167.335 50.244 170.327 51.564V21.6H177.587V114ZM170.327 58.164C166.807 56.668 163.287 55.436 159.767 54.468C156.335 53.412 152.507 52.884 148.283 52.884C147.139 52.884 145.775 53.06 144.191 53.412C142.607 53.764 141.023 54.424 139.439 55.392C137.943 56.36 136.667 57.812 135.611 59.748C134.555 61.596 134.027 64.06 134.027 67.14V90.768C134.027 93.936 134.379 96.708 135.083 99.084C135.787 101.372 136.975 103.308 138.647 104.892C140.319 106.388 142.563 107.488 145.379 108.192C148.283 108.808 151.935 109.072 156.335 108.984C158.007 108.896 159.547 108.808 160.955 108.72C162.451 108.632 163.771 108.544 164.915 108.456C166.059 108.368 167.027 108.28 167.819 108.192C168.611 108.104 169.227 108.06 169.667 108.06C170.107 107.972 170.327 107.928 170.327 107.928V58.164Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    <motion.path 
      key="t2"
      d="M233.522 89.58C233.522 97.324 231.542 103.572 227.582 108.324C223.622 112.988 217.638 115.32 209.63 115.32C204.174 115.32 199.554 114.176 195.77 111.888C192.074 109.512 189.302 106.388 187.454 102.516C185.606 98.644 184.682 94.332 184.682 89.58V72.288C184.682 66.656 185.65 61.948 187.586 58.164C189.522 54.292 192.338 51.388 196.034 49.452C199.73 47.428 204.174 46.416 209.366 46.416C217.198 46.416 223.182 48.704 227.318 53.28C231.454 57.856 233.522 64.192 233.522 72.288V89.58ZM226.13 72.288C226.13 68.064 225.558 64.544 224.414 61.728C223.27 58.824 221.466 56.668 219.002 55.26C216.626 53.764 213.502 53.016 209.63 53.016C205.758 53.016 202.502 53.764 199.862 55.26C197.31 56.668 195.374 58.824 194.054 61.728C192.734 64.544 192.074 68.064 192.074 72.288V90.9C192.074 94.42 192.778 97.544 194.186 100.272C195.682 102.912 197.75 104.98 200.39 106.476C203.03 107.972 206.11 108.72 209.63 108.72C213.326 108.72 216.406 108.016 218.87 106.608C221.334 105.112 223.138 103.044 224.282 100.404C225.514 97.676 226.13 94.508 226.13 90.9V72.288Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    <motion.path 
      key="e"
      d="M318.056 68.856C318.056 65.864 317.616 63.4 316.736 61.464C315.856 59.44 314.668 57.856 313.172 56.712C311.676 55.48 309.96 54.644 308.024 54.204C306.176 53.676 304.196 53.412 302.084 53.412C300.412 53.412 298.608 53.588 296.672 53.94C294.824 54.292 292.888 54.864 290.864 55.656C288.928 56.448 286.904 57.504 284.792 58.824C285.32 60.232 285.672 61.772 285.848 63.444C286.112 65.028 286.244 66.744 286.244 68.592V114H279.38V68.856C279.38 65.864 278.94 63.4 278.06 61.464C277.18 59.44 275.992 57.856 274.496 56.712C273.088 55.48 271.416 54.644 269.48 54.204C267.544 53.676 265.52 53.412 263.408 53.412C261.384 53.412 259.492 53.588 257.732 53.94C256.06 54.292 254.432 54.82 252.848 55.524C251.264 56.228 249.548 57.108 247.7 58.164V114H240.176V48H247.7V52.488C249.46 51.344 251.22 50.376 252.98 49.584C254.74 48.704 256.588 48.044 258.524 47.604C260.46 47.076 262.528 46.812 264.728 46.812C267.544 46.812 270.052 47.12 272.252 47.736C274.54 48.264 276.52 49.1 278.192 50.244C279.952 51.3 281.404 52.62 282.548 54.204C284.484 52.708 286.596 51.432 288.884 50.376C291.172 49.232 293.548 48.352 296.012 47.736C298.476 47.12 300.94 46.812 303.404 46.812C307.1 46.812 310.268 47.296 312.908 48.264C315.636 49.144 317.88 50.508 319.64 52.356C321.488 54.204 322.852 56.492 323.732 59.22C324.612 61.948 325.052 65.072 325.052 68.592V114H318.056V68.856Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    <motion.path 
      key="r"
      d="M410.002 68.856C410.002 65.864 409.562 63.4 408.682 61.464C407.802 59.44 406.614 57.856 405.118 56.712C403.622 55.48 401.906 54.644 399.97 54.204C398.122 53.676 396.142 53.412 394.03 53.412C392.358 53.412 390.554 53.588 388.618 53.94C386.77 54.292 384.834 54.864 382.81 55.656C380.874 56.448 378.85 57.504 376.738 58.824C377.266 60.232 377.618 61.772 377.794 63.444C378.058 65.028 378.19 66.744 378.19 68.592V114H371.326V68.856C371.326 65.864 370.886 63.4 370.006 61.464C369.126 59.44 367.938 57.856 366.442 56.712C365.034 55.48 363.362 54.644 361.426 54.204C359.49 53.676 357.466 53.412 355.354 53.412C353.33 53.412 351.438 53.588 349.678 53.94C348.006 54.292 346.378 54.82 344.794 55.524C343.21 56.228 341.494 57.108 339.646 58.164V114H332.122V48H339.646V52.488C341.406 51.344 343.166 50.376 344.926 49.584C346.686 48.704 348.534 48.044 350.47 47.604C352.406 47.076 354.474 46.812 356.674 46.812C359.49 46.812 361.998 47.12 364.198 47.736C366.486 48.264 368.466 49.1 370.138 50.244C371.898 51.3 373.35 52.62 374.494 54.204C376.43 52.708 378.542 51.432 380.83 50.376C383.118 49.232 385.494 48.352 387.958 47.736C390.422 47.12 392.886 46.812 395.35 46.812C399.046 46.812 402.214 47.296 404.854 48.264C407.582 49.144 409.826 50.508 411.586 52.356C413.434 54.204 414.798 56.492 415.678 59.22C416.558 61.948 416.998 65.072 416.998 68.592V114H410.002V68.856Z"
      style={{ fill: color, stroke: color, strokeWidth: '1px' }}
      variants={childVariants}
    />,
    // The two animated lines
    <motion.line key="line1" x1="21" y1="15" x2="21" y2="40" stroke={color} strokeWidth="8" variants={childVariants} />,
    <motion.line key="line2" x1="47" y1="15" x2="47" y2="40" stroke={color} strokeWidth="8" variants={childVariants} />
  ];

  return (
    <motion.svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox="0 0 422 132"
      fill="none"
      mask={mask}
      xmlns="http://www.w3.org/2000/svg"

      initial="hidden"
      animate={controls}
      variants={containerVariants}
      style={{ overflow: 'visible' }}
    >
      <g transform={transform}>
        {letterPaths}
      </g>
    </motion.svg>
  );
};

const MainLoader = ({ initialProgress = null }) => {
  const [time, setTime] = useState(5);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const containerRef = useRef(null);
  const timerRef     = useRef(null);
  const waveRef      = useRef(null);

  const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;

  const smoothLoadingPercent = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const waveHeightTransform = useTransform(
    smoothLoadingPercent,
    [0, 100],
    [height * 1.1, (height * 1.1 - height) * -1]
  );

  const generateWavePath = (amplitude, frequency, phase, verticalSpeed, yOffset) => {
    // Extend beyond the width of the screen
    const extendedWidth = width + 100;

    let path = `M -100 ${height + 100}`;

    // Get the current loading height value
    const loadingHeight = waveHeightTransform.get();

    // sine : time
    const verticalOffset = Math.sin(time * verticalSpeed) * 20;

    const adjustedHeight = loadingHeight + yOffset + verticalOffset;

    for (let x = -100; x <= extendedWidth; x += 5) {
      const y = Math.sin(x * frequency * 0.01 + time + phase) * amplitude + adjustedHeight;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${extendedWidth} ${height + 100} L -100 ${height + 100} Z`;

    return path;
  };

  const waves = [
    { amplitude: 20, frequency: 1, phase: 0, opacity: 0.8, yOffset: 0, verticalSpeed: 1.9, color: "#222222" },
    { amplitude: 18, frequency: 0.75, phase: 1, opacity: 0.6, yOffset: 15, verticalSpeed: 1.75, color: "#222222" },
    { amplitude: 15, frequency: 1.25, phase: 0.5, opacity: 0.5, yOffset: 30, verticalSpeed: 1.6, color: "#222222" }
  ];

  useEffect(() => {
    // Set initialized
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (initialProgress !== null) {
      setLoadingPercent(initialProgress);
      smoothLoadingPercent.set(initialProgress);
      return;
    }

    const updateLoadingPercent = () => {
      setLoadingPercent(prevPercent => {
        if (prevPercent < 100) {
          const increment = 6; // loading demo
          const newPercent = Math.min(prevPercent + increment, 100);

          // Update the smooth spring value
          smoothLoadingPercent.set(newPercent);

          if (newPercent < 100) {
            timerRef.current = gsap.delayedCall(0.05, updateLoadingPercent);
          }

          return newPercent;
        }
        return prevPercent;
      });
    };

    // Start the loading
    updateLoadingPercent();

    return () => {
      if (timerRef.current) {
        timerRef.current.kill();
      }
    };
  }, [initialProgress, smoothLoadingPercent, isInitialized]);

  // Handle wave
  useEffect(() => {
    if (!isInitialized) return;

    let animationFrame;
    const animate = () => {
      setTime(prevTime => prevTime + 0.01);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInitialized]);

  if (!isInitialized && typeof window !== 'undefined') {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen flex items-center justify-center bg-red-400 overflow-hidden"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Define the wave mask for the logo */}
          <mask id="wave-mask">
            <rect width={width} height={(height)} fill="white" />
            {waves.map((wave, index) => (
              <path
                key={`mask-${index}`}
                d={generateWavePath(wave.amplitude, wave.frequency, wave.phase, wave.verticalSpeed, wave.yOffset)}
                fill="black"
              />
            ))}

          </mask>
        </defs>



        <g className="waves" ref={waveRef}>
          {waves.map((wave, index) => (
            <path
              key={`wave-${index}`}
              d={generateWavePath(wave.amplitude, wave.frequency, wave.phase, wave.verticalSpeed, wave.yOffset)}
              fill={wave.color}
              opacity={wave.opacity}
            />
          ))}
        </g>


        <RemakeLogo
          width="422"
          height="132"
          color="white"
          transform={`translate(${width / 2 - 211}, ${height / 2 - 66})`}
        />

        <RemakeLogo
          width="422"
          height="132"
          color="black"
          transform={`translate(${width / 2 - 211}, ${height / 2 - 66})`}
          mask="url(#wave-mask)"
        />

        <text
          x={width / 2}
          y={height / 2 + 100}
          textAnchor="middle"
          fontSize="24"
          fill="white"
          fontFamily="Helvetica, Arial, sans-serif"
          className="tracking-wider font-concert-one"
        >
          Loading...
        </text>
      </svg>
    </motion.div>
  );
};

export default MainLoader;