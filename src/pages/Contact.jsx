import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Contact = () => {
  const { isLightTheme } = useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen ${isLightTheme ? 'bg-blue-50' : ''}`}>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">Contact Us</h1>
          <p className={`text-xl ${isLightTheme ? 'text-gray-800' : 'text-blue-200'} mb-12`}>We would love to hear from you. Please reach out to us through the form below.</p>
        </div>
        
        <div className="flex justify-center">
          <form className={`w-full max-w-2xl backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} p-8 rounded-2xl shadow-2xl border transform transition-all duration-500`}>
            <div className="mb-6">
              <label htmlFor="name" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-2`}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`} 
                placeholder="John Doe" 
                required 
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-2`}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`} 
                placeholder="john.doe@example.com" 
                required 
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-2`}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`} 
                placeholder="Your message here..." 
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
