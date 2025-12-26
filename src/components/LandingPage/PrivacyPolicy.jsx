import React from 'react';
import StarryBackground from '../../components/effects/StarryBackground';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <StarryBackground>
      <div className="min-h-screen text-gray-300 p-8 md:p-16 max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="space-y-8 bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">1. Information We Collect</h2>
            <p>
              We collect information to provide and improve our service. This includes:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with the app, such as lesson progress, scores, and game performance metrics (reaction time, accuracy).</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers for analytics and troubleshooting.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">2. How We Use Your Information</h2>
            <p>
              We use your data to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Provide, operate, and maintain the NeuroSwitch platform.</li>
              <li>Personalize your learning experience and track your progress.</li>
              <li>Analyze usage trends to improve our games and curriculum.</li>
              <li>Communicate with you regarding updates, security alerts, and support.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share information with third-party service providers (such as our database hosting provider, Appwrite) solely for the purpose of operating our service. We may also disclose data if required by law or to protect our rights.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">5. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete your personal data. You can manage your account settings within the app or contact us to exercise these rights.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">6. Children's Privacy</h2>
            <p>
              NeuroSwitch is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">7. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@neuroswitch.com" className="text-purple-400 hover:underline">privacy@neuroswitch.com</a>.
            </p>
          </div>

        </section>

        <div className="mt-8 text-center">
          <Link to="/" className="text-purple-400 hover:text-white transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </StarryBackground>
  );
};

export default PrivacyPolicy;
