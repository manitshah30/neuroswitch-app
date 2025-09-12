import logoImg from '../../assets/Logo.png';

// 1. We accept a function called 'onSignInClick' as a prop
function Navbar({ onSignInClick }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <img src={logoImg} alt="NeuroSwitch Logo" className="w-20 h-20" />
          <span className="text-3xl font-bold text-white">NeuroSwitch</span>
        </a>
        
        {/* 2. We change the <a> tag to a <button> and attach the onClick event */}
        <button 
          onClick={onSignInClick} 
          className="bg-brand-primary text-slate-800 font-semibold px-5 py-2 rounded-lg hover:bg-white transition-colors text-xl"
        >
          Sign In
        </button>
      </div>
    </header>
  );
}

export default Navbar;