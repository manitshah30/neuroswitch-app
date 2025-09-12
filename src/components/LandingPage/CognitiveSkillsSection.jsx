function CognitiveSkillsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        
        <h2 className="text-3xl font-bold text-brand-text mb-8">
          Targeted Cognitive Skills
        </h2>

        {/* This grid creates the 2x3 layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {/* CHANGE IS HERE: We've added transition and hover classes to each pill */}
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Sustained Attention
          </div>
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Working Memory
          </div>
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Cognitive Flexibility
          </div>
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Selective Attention
          </div>
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Processing Speed
          </div>
          <div className="bg-brand-primary text-xl text-slate-800 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105">
            Problem Solving
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default CognitiveSkillsSection;
