import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { ThemeContext } from "../context/ThemeContext";

// Particle component for background effect
const Particle = ({ className }) => {
  const { isLightTheme } = useContext(ThemeContext);
  
  return (
    <motion.div
      className={`absolute rounded-full ${isLightTheme ? 'bg-blue-500' : 'bg-blue-400'} ${isLightTheme ? 'opacity-40' : 'opacity-70'} ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isLightTheme ? [0, 0.2, 0] : [0, 0.4, 0], 
        scale: [0, 1, 0.5],
        y: [0, -100],
        x: Math.random() > 0.5 ? [0, 50] : [0, -50] 
      }}
      transition={{ 
        duration: 5 + Math.random() * 7,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    />
  );
};

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const { isLightTheme } = useContext(ThemeContext);
  
  // Generate an array of letters from the slogan for letter animation
  const slogan = "The Future of Bidding Starts Here!";
  const letters = slogan.split("");
  
  // Start the sequence when component mounts
  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 1 + i * 0.05,
        duration: 0.3
      }
    }));
  }, [controls]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden min-h-[50vh]">
      {/* Particles background */}
      {[...Array(15)].map((_, i) => (
        <Particle 
          key={i} 
          className={`w-${2 + Math.floor(Math.random() * 8)} h-${2 + Math.floor(Math.random() * 8)}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Container with relative positioning for both logo and text */}
      <div className="relative z-10">
        {/* Logo with improved animation and hover effect */}
        <motion.img
          className="w-full sm:w-1/2 md:w-2/5 lg:w-[1000px] mx-auto cursor-pointer" 

          src={isLightTheme ? assets.herologoblack : assets.herologo}
          alt="Logo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 } 
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ 
            duration: 1.2,
            ease: "easeOut"
          }}
        />
        
        {/* Glowing effect that appears on hover */}
        <motion.div
          className={`absolute top-0 left-0 w-full h-full rounded-full ${isLightTheme ? 'bg-blue-300' : 'bg-blue-500'} filter blur-3xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? (isLightTheme ? 0.1 : 0.15) : 0 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: -1 }}
        />
        
        {/* Animated letter-by-letter slogan */}
        <div 
          className={`absolute text-center text-xl ${isLightTheme ? 'text-gray-800' : 'text-gray-300'}`}
          style={{ 
            top: "70%", 
            right: "13%",
            width: "50%",
            marginTop: "5px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
      </div>
      
      {/* Floating CTA button */}
      
    </div>
  );
};

export default Hero;