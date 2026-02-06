import { motion } from 'framer-motion';
import { PersonalProfile, BusinessProfile, InsightData, ScenarioAnalysis } from '../types';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain, Sparkles, AlertCircle, CheckCircle, Target, Zap } from 'lucide-react';

interface Props {
  personalProfile: PersonalProfile;
  businessProfile: BusinessProfile;
}

export default function Dashboard({ personalProfile, businessProfile }: Props) {
  // Generate insights based on business profile
  const generateInsights = (): InsightData[] => {
    return [
      {
        category: 'Market Growth',
        value: 78,
        trend: 'up',
        recommendation: 'Expand digital presence to capture emerging market segments',
      },
      {
        category: 'Operational Efficiency',
        value: 65,
        trend: 'up',
        recommendation: 'Automate repetitive processes to improve productivity',
      },
      {
        category: 'Customer Satisfaction',
        value: 82,
        trend: 'stable',
        recommendation: 'Maintain current service quality while exploring enhancement opportunities',
      },
      {
        category: 'Innovation Index',
        value: 71,
        trend: 'up',
        recommendation: 'Invest in R&D to stay ahead of industry trends',
      },
    ];
  };

  // Generate scenario analysis
  const generateScenarios = (): ScenarioAnalysis[] => {
    return [
      {
        title: 'Market Expansion',
        description: 'Expand to 3 new geographic markets within the next 12 months',
        impact: 'high',
        actionItems: [
          'Conduct market research in target regions',
          'Develop localized marketing strategies',
          'Establish partnerships with local distributors',
          'Hire regional sales representatives',
        ],
        projectedOutcome: '40% revenue increase, 25% brand awareness boost',
      },
      {
        title: 'Digital Transformation',
        description: 'Implement AI-driven automation across core business processes',
        impact: 'high',
        actionItems: [
          'Audit current technological infrastructure',
          'Select and integrate AI automation tools',
          'Train staff on new systems',
          'Monitor and optimize performance metrics',
        ],
        projectedOutcome: '30% cost reduction, 50% faster processing times',
      },
      {
        title: 'Product Innovation',
        description: 'Launch new premium product line targeting high-value customers',
        impact: 'medium',
        actionItems: [
          'Conduct customer feedback sessions',
          'Develop prototype and test with focus groups',
          'Refine based on feedback',
          'Plan marketing and launch strategy',
        ],
        projectedOutcome: '20% revenue increase, improved brand positioning',
      },
    ];
  };

  const insights = generateInsights();
  const scenarios = generateScenarios();

  // Data for charts
  const performanceData = [
    { month: 'Jan', performance: 65, target: 70 },
    { month: 'Feb', performance: 68, target: 72 },
    { month: 'Mar', performance: 72, target: 75 },
    { month: 'Apr', performance: 75, target: 78 },
    { month: 'May', performance: 78, target: 80 },
    { month: 'Jun', performance: 82, target: 82 },
  ];

  const distributionData = [
    { name: 'Sales', value: 35 },
    { name: 'Marketing', value: 25 },
    { name: 'Operations', value: 20 },
    { name: 'R&D', value: 20 },
  ];

  const COLORS = ['#6172f3', '#4340cc', '#8196fa', '#a5bbfd'];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 py-12"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="luxury-card"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-quantum-500 to-quantum-700 rounded-xl shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold gradient-text">
                  Quantum Intelligence Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back, {personalProfile.firstName} • {businessProfile.businessName}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-luxury-gold" />
            </motion.div>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6 gradient-text">
            Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.category}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="luxury-card hover:luxury-glow transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">{insight.category}</h3>
                  {getTrendIcon(insight.trend)}
                </div>
                <div className="mb-4">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {insight.value}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-quantum-500 to-quantum-700 h-2 rounded-full"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{insight.recommendation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Charts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="luxury-card">
            <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#6172f3" 
                  strokeWidth={3}
                  dot={{ fill: '#6172f3', r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#d4af37" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#d4af37', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="luxury-card">
            <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
              Resource Allocation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scenario Analysis */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6 gradient-text flex items-center gap-3">
            <Zap className="w-8 h-8" />
            Scenario-Based Optimization
          </h2>
          <div className="space-y-6">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="luxury-card hover:luxury-glow transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${getImpactColor(scenario.impact)} rounded-xl text-white`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{scenario.title}</h3>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium text-white ${getImpactColor(scenario.impact)}`}>
                        {scenario.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{scenario.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {scenario.actionItems.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 + itemIndex * 0.05 }}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-quantum-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-quantum-50 to-luxury-champagne rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Projected Outcome
                      </h4>
                      <p className="text-gray-800 font-medium">{scenario.projectedOutcome}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Challenges & Objectives */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="luxury-card">
            <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
              Current Challenges
            </h3>
            <div className="space-y-3">
              {businessProfile.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                >
                  <p className="text-gray-700">{challenge}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="luxury-card">
            <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
              Business Objectives
            </h3>
            <div className="space-y-3">
              {businessProfile.objectives.map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
                >
                  <p className="text-gray-700">{objective}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Personal Goals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="luxury-card"
        >
          <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
            Your Personal Goals
          </h3>
          <div className="flex flex-wrap gap-3">
            {personalProfile.goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="px-6 py-3 bg-gradient-to-r from-quantum-100 to-quantum-200 text-quantum-700 rounded-full font-medium"
              >
                {goal}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
