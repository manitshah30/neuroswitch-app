import { Link } from 'react-router-dom';
import logoImg from '../../assets/Logo.png';

function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Brand Name */}
         <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-20 h-20" />
          <span className="text-3xl font-bold text-white">NeuroSwitch</span>
        </Link>
        
        {/* Right Side: Sign In Button */}
        <Link 
          to="/signin" 
          className="bg-brand-primary text-slate-800 font-semibold px-5 py-2 rounded-lg hover:bg-white transition-colors text-xl"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
