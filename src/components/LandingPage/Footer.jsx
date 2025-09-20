import React from 'react';
// Make sure the path to your logo is correct
import logo from '../../assets/Logo.png'; 

function Footer() {
  return (
    <footer className="bg-slate-800 rounded-2xl p-8 md:p-12 text-white mt-20">
      <div className="container mx-auto">
        {/* Main footer content with three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Brand Information */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="NeuroSwitch Logo" className="w-10 h-10" />
              <span className="font-bold text-2xl">NeuroSwitch</span>
            </a>
            <p className="text-slate-400">
              An interactive web platform that enhances cognitive skills and multilingual proficiency through gamified challenges.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-200">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-200">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Separator Line and Copyright */}
        <hr className="my-8 border-slate-700" />

        <div className="text-center text-slate-500">
          <p>&copy; 2025 NeuroSwitch. All rights reserved</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;