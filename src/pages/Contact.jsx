import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">Contact Us</h1>
          <p className="text-xl text-blue-200 mb-12">We would love to hear from you. Please reach out to us through the form below.</p>
        </div>
        
        <div className="flex justify-center">
          <form className="w-full max-w-2xl backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-800/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                placeholder="John Doe" 
                required 
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-800/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                placeholder="john.doe@example.com" 
                required 
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-blue-200 mb-2">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-800/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
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
