
import MissionCard from './MissionCard';
import DailyRewardCard from './DailyRewardCard';
import StarryBackground from '../effects/StarryBackground';
import CognitiveCoreCard from './CognitiveCoreCard';
import CogCoreCard from './CogCoreCard';
import LearningUniverse from './LearningUniverse';
import AchievementsCard from './AchievementsCard';
import WeeklyRanksCard from './WeeklyRanksCard';

function DashboardPage() {
  const currentUser = { name: "Alex" };
  const currentMission = {
    title: "Week 1",
    description: "Master foundational greetings, people, and actions.",
    xp: "+250",
  };
  const dailyReward = { claimed: false };

  return (
    <StarryBackground>
      <div className="relative z-10 min-h-screen">


        <main className="p-8">
          {/* Welcome Message Section */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white tracking-tight">Welcome back, {currentUser.name}!</h1>
            <p className="text-gray-400 text-lg mt-2">Here's your mission and performance overview.</p>
          </div>

          {/* Top Cards Section (Mission and Daily Reward) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"> {/* Added mb-12 for spacing */}
            <div className="lg:col-span-2">
              <MissionCard
                missionTitle={currentMission.title}
                missionDescription={currentMission.description}
                rewardXP={currentMission.xp}
              />
            </div>
            <DailyRewardCard 
              isClaimed={dailyReward.claimed}
            />
          </div>

          {/* New Performance Data Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-8">Your Performance Data</h2> {/* Title for this section */}
            {/* The Cognitive Core Card */}
            <div className="w-full max-w-4xl mx-auto h-[450px]"> {/* Centered and given a fixed height */}
              <CognitiveCoreCard />
            </div>

            <div className="mt-12 max-w-4xl mx-auto h-[500px]"> {/* Add margin-top for spacing */}
            <CogCoreCard />
          </div>


          </div>
          <LearningUniverse />
          {/* You can add more dashboard sections here later */}
          <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Community & Progression</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <AchievementsCard />
        <WeeklyRanksCard />
      </div>
    </section>
        </main>
      </div>
    </StarryBackground>
  );
}

export default DashboardPage;