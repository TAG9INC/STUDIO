export interface PersonalProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  goals: string[];
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  yearEstablished: number;
  companySize: string;
  revenue: string;
  targetMarket: string;
  challenges: string[];
  objectives: string[];
}

export interface InsightData {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export interface ScenarioAnalysis {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionItems: string[];
  projectedOutcome: string;
}
