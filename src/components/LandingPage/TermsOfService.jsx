import React from 'react';
import StarryBackground from '../../components/effects/StarryBackground';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <StarryBackground>
      <div className="min-h-screen text-gray-300 p-8 md:p-16 max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="space-y-8 bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">1. Introduction</h2>
            <p>
              Welcome to NeuroSwitch. By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">2. Use of Service</h2>
            <p>
              NeuroSwitch provides a cognitive language learning platform designed for educational and entertainment purposes. You agree to use the service only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>You must be at least 13 years old to use this service.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree not to disrupt or interfere with the security or performance of the service.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">3. User Accounts</h2>
            <p>
              To access certain features, you may be required to create an account. You agree to provide accurate and complete information. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">4. Intellectual Property</h2>
            <p>
              All content, including text, graphics, logos, and software, is the property of NeuroSwitch or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without express permission.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">5. Limitation of Liability</h2>
            <p>
              NeuroSwitch is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the service. We do not guarantee that the service will be uninterrupted or error-free.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. Please check this page periodically for updates.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@neuroswitch.com" className="text-cyan-400 hover:underline">support@neuroswitch.com</a>.
            </p>
          </div>

        </section>

        <div className="mt-8 text-center">
          <Link to="/" className="text-cyan-400 hover:text-white transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </StarryBackground>
  );
};

export default TermsOfService;