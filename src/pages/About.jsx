
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const founders = [
    {
      name: "Shahroz Asif",
      role: "Backend Developer",
      
      description: "Handles the logic and databases behind the scenes, ensuring secure and scalable backend operations."
    },
    {
      name: "Raza Aziz",
      role: "Backend Developer",
      
      description: "Focused on API architecture and blockchain integration to make bidding more transparent and reliable."
    },
    {
      name: "Ahmed Baig",
      role: "Frontend Developer",
      
      description: "Crafts intuitive and beautiful UI to give users the best possible experience while bidding."
    },
    {
      name: "Syed Noor-ul Talha",
      role: "Frontend Developer",
      
      description: "Ensures a responsive and accessible design with smooth user interaction across all devices."
    },
  ];

  return (
    <div className="min-h-screen px-4 py-16 sm:px-10 dark:bg-gray-900 dark:text-white   border-4 border-blue-400 p-6 rounded-lg">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
          Welcome to BidSphere
        </h1>

        <p className="text-xl mb-8 text-center dark:text-white text-gray-900">
          Revolutionizing online auctions in Pakistan with blockchain innovation.
        </p>

        <div className="space-y-8 text-lg leading-relaxed dark:text-white text-gray-900">
          <motion.p initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <span className="text-yellow-400 font-semibold">BidSphere</span> is Pakistan’s <span className="text-green-400 font-semibold">first blockchain-based bidding platform</span>, designed to bring a new level of trust, security, and transparency to online auctions.
          </motion.p>
          <motion.p initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            We offer both <span className="text-blue-400 font-medium">traditional</span> and <span className="text-green-400 font-medium">blockchain-powered bidding</span> so everyone can bid with confidence — from casual users to tech-savvy traders.
          </motion.p>
          <motion.p initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            Every transaction is logged immutably, meaning no hidden changes, fake bids, or shady dealings. We’re here to empower <span className="font-semibold text-purple-400">buyers and sellers</span> with the freedom of transparency.
          </motion.p>
          <motion.p initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <span className="text-yellow-400 font-semibold">BidSphere</span> is more than just an auction site — it’s a community where trust meets technology.
          </motion.p>
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-xl font-medium dark:text-white text-gray-900 mb-4">Ready to experience the future of online bidding?</p>
          <Link 
            to="/register" 
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full transition"
          >
            Join BidSphere Now
          </Link>
        </motion.div>
      </motion.div>

      {/* Founders Section */}
      <motion.div 
        className="max-w-6xl mx-auto mt-20 pt-10 border-t border-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center   mb-10 flex items-center justify-center gap-2">
          <div className=" " /> Meet the Founders
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.5 }}
              className="bg-gray-800 rounded-xl p-5 text-center shadow hover:shadow-xl transition"
            >
              
              <h3 className="text-xl font-bold text-white">{founder.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{founder.role}</p>
              
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
