function AboutUs() {
  return (
    // 'py-20' adds padding to the top and bottom of the section.
    <section className="py-20 px-4">
      <div className="container mx-auto">
        
        {/* The top bar from your design, using our custom brand colors */}
        <div className="bg-brand-primary rounded-lg p-6 mb-12">
          <h2 className="text-4xl font-bold text-slate-800">About Us</h2>
          <p className="text-xl font-semibold text-slate-700 mt-1">Our Vision</p>
        </div>

        {/* The main content card, also using a solid color */}
        <div className="max-w-3xl mx-auto bg-brand-primary text-center rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            What is NeuroSwitch?
          </h3>
          <p className="text-slate-600 text-xl leading-relaxed">
            NeuroSwitch is an innovative web-based intervention that combines
            language learning with cognitive skill training through engaging,
            game-based activities, grounded in psychological theory and applied
            research from a doctoral thesis in Cognitive Neuroscience.
          </p>
        </div>

      </div>
    </section>
  );
}

export default AboutUs;