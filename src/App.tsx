import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalProfileForm from './components/PersonalProfileForm';
import BusinessProfileForm from './components/BusinessProfileForm';
import Dashboard from './components/Dashboard';
import { PersonalProfile, BusinessProfile } from './types';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';

type Step = 'welcome' | 'personal' | 'business' | 'dashboard';

function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);

  const handlePersonalComplete = (profile: PersonalProfile) => {
    setPersonalProfile(profile);
    setStep('business');
  };

  const handleBusinessComplete = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setStep('dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-quantum-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="luxury-card max-w-4xl w-full text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <Brain className="w-24 h-24 text-quantum-600" strokeWidth={1.5} />
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-8 h-8 text-luxury-gold" />
                    </motion.div>
                  </div>
                </div>

                <h1 className="text-6xl font-display font-bold mb-6 gradient-text">
                  Quantum Intelligence Studio
                </h1>
                
                <p className="text-xl text-gray-600 mb-4 font-light leading-relaxed">
                  Experience the future of business intelligence
                </p>
                
                <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                  A sophisticated platform that transforms your personal and business data 
                  into actionable insights through elegant visualization and scenario-based optimization.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    type="button"
                    onClick={() => setStep('personal')}
                    className="luxury-button flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Begin your journey to the personal profile form"
                  >
                    <Sparkles className="w-5 h-5" />
                    Begin Your Journey
                  </motion.button>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Powered by Quantum AI</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'personal' && (
          <PersonalProfileForm onComplete={handlePersonalComplete} />
        )}

        {step === 'business' && (
          <BusinessProfileForm onComplete={handleBusinessComplete} />
        )}

        {step === 'dashboard' && personalProfile && businessProfile && (
          <Dashboard
            personalProfile={personalProfile}
            businessProfile={businessProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
