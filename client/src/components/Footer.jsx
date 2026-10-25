import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">
              Luxe<span className="text-yellow-500">Stay</span>
            </h2>
            <p className="text-sm max-w-sm">
              Experience the pinnacle of luxury and comfort. Book the world's most exclusive hotels, resorts, and villas with unmatched service and best price guarantees.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-yellow-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition">Contact</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>support@luxestay.com</li>
              <li>+1 (800) 123-4567</li>
              <li>123 Luxury Ave, NY 10001, USA</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
