import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, Calendar, Users, DollarSign, Target, ArrowRight, Plus, X } from 'lucide-react';
import { BusinessProfile } from '../types';

interface Props {
  onComplete: (profile: BusinessProfile) => void;
}

export default function BusinessProfileForm({ onComplete }: Props) {
  const [formData, setFormData] = useState<BusinessProfile>({
    businessName: '',
    industry: '',
    yearEstablished: new Date().getFullYear(),
    companySize: '',
    revenue: '',
    targetMarket: '',
    challenges: [],
    objectives: [],
  });

  const [challengeInput, setChallengeInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const addChallenge = () => {
    if (challengeInput.trim()) {
      setFormData({
        ...formData,
        challenges: [...formData.challenges, challengeInput.trim()],
      });
      setChallengeInput('');
    }
  };

  const removeChallenge = (index: number) => {
    setFormData({
      ...formData,
      challenges: formData.challenges.filter((_, i) => i !== index),
    });
  };

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, objectiveInput.trim()],
      });
      setObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    });
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Manufacturing',
    'Education', 'Real Estate', 'Consulting', 'Marketing', 'Retail', 'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const revenueRanges = [
    'Pre-revenue',
    '$0 - $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M - $10M',
    '$10M+'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen flex items-center justify-center p-4 py-12"
    >
      <div className="luxury-card max-w-4xl w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-quantum-500 to-quantum-700 rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-display font-bold gradient-text">
                Business Profile
              </h2>
              <p className="text-gray-500 mt-1">Tell us about your business</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="luxury-input"
                required
                placeholder="Your company name"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="luxury-input"
                  required
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Year Established
                </label>
                <input
                  type="number"
                  value={formData.yearEstablished}
                  onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) })}
                  className="luxury-input"
                  required
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="luxury-input"
                  required
                >
                  <option value="">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Annual Revenue
                </label>
                <select
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="luxury-input"
                  required
                >
                  <option value="">Select range</option>
                  {revenueRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Market
              </label>
              <textarea
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                className="luxury-input min-h-[100px] resize-none"
                placeholder="Describe your target market and customer base..."
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <X className="w-4 h-4" />
                Current Challenges
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChallenge())}
                  className="luxury-input flex-1"
                  placeholder="Add a challenge..."
                />
                <button
                  type="button"
                  onClick={addChallenge}
                  className="px-6 py-4 bg-quantum-600 text-white rounded-xl hover:bg-quantum-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2"
                  >
                    <span>{challenge}</span>
                    <button
                      type="button"
                      onClick={() => removeChallenge(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Business Objectives
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={objectiveInput}
                  onChange={(e) => setObjectiveInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  className="luxury-input flex-1"
                  placeholder="Add an objective..."
                />
                <button
                  type="button"
                  onClick={addObjective}
                  className="px-6 py-4 bg-quantum-600 text-white rounded-xl hover:bg-quantum-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.objectives.map((objective, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2"
                  >
                    <span>{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end pt-4"
            >
              <motion.button
                type="submit"
                className="luxury-button flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Your Intelligence Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
