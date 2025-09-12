import GlassCard from '../GlassCard';

function FeatureCard() {
  return (
    <section className="py-20 px-4">
      {/* Container to control the overall width, making cards feel narrower */}
      <div className="container mx-auto max-w-6xl"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          {/* Card 1: Grounded in Science */}
          {/* CHANGE IS HERE: We add a min-height class to make the card taller */}
          <GlassCard className="p-8 flex flex-col items-center min-h-[340px]">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <div className="absolute w-full h-full bg-brand-primary/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-[#2A2929] rounded-full flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-brand-text mb-3">Grounded in Science</h3>
            <p className="text-brand-text-muted leading-relaxed">Built upon a foundation of cognitive neuroscience research.</p>
          </GlassCard>

          {/* Card 2: Designed for Engagement */}
          {/* CHANGE IS HERE: We add a min-height class to make the card taller */}
          <GlassCard className="p-8 flex flex-col items-center min-h-[340px]">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <div className="absolute w-full h-full bg-brand-primary/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-[#2A2929] rounded-full flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-brand-text mb-3">Designed for Engagement</h3>
            <p className="text-brand-text-muted leading-relaxed">Utilizing game-based activities and stories to make learning fun.</p>
          </GlassCard>

          {/* Card 3: Built for Everyone */}
          {/* CHANGE IS HERE: We add a min-height class to make the card taller */}
          <GlassCard className="p-8 flex flex-col items-center min-h-[340px]">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <div className="absolute w-full h-full bg-brand-primary/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-[#2A2929] rounded-full flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.75 3.75 0 0 1 5.958 0m0 0a3.75 3.75 0 0 1-5.958 0M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-brand-text mb-3">Built for Everyone</h3>
            <p className="text-brand-text-muted leading-relaxed">Serving diverse communities, from general learning to therapeutic aid.</p>
          </GlassCard>

        </div>
      </div>
    </section>
  );
}

export default FeatureCard;
