import React from 'react';

const Contact = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen border-4 border-blue-400 p-6 rounded-lg">
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6">Contact Us</h1>
          <p className="text-lg text-gray-400 mb-12">We would love to hear from you. Please reach out to us through the form below.</p>
        </div>
        
        <div className="flex justify-center ">
          <form className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg p-6 rounded-lg border-4 border-blue-100">
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg text-gray-900 mb-2 dark:text-white">Full Name</label>
              <input type="text" id="name" name="name" className="w-full p-3 rounded-md dark:bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="John Doe" required />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-lg text-gray-900 mb-2 dark:text-white">Email Address</label>
              <input type="email" id="email" name="email" className="w-full p-3 rounded-md dark:bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="john.doe@example.com" required />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-lg text-gray-900 mb-2 dark:text-white">Message</label>
              <textarea id="message" name="message" rows="4" className="w-full p-3 rounded-md dark:bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Your message here..." required></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="bg-green-400 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400">Send Message</button>
            </div>
          </form>
        </div>
      </section>

    
    </div>
  );
}

export default Contact;
