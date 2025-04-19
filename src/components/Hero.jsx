import { motion } from "framer-motion";
import assets from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-400 py-[150px] ">
      {/* Animated Logo */}
      <motion.img
        className="w-full sm:w-1/2"
        src={assets.bidsphere}
        alt="Logo"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Slogan with Delay */}
      <motion.p
        className="text-l font-semibold mt-5 opacity-0 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        "The Future of Bidding Starts Here!"
      </motion.p>
    </div>
  );
};

export default Hero;
