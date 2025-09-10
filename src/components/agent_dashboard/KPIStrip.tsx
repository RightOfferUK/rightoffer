'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  color: 'blue' | 'green' | 'purple' | 'purple' | 'red' | 'gray';
  index: number;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color,
  index 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      value: 'text-blue-300',
      trend: 'text-blue-400'
    },
    green: {
      bg: 'bg-green-500/20',
      icon: 'text-green-400',
      value: 'text-green-300',
      trend: 'text-green-400'
    },
    purple: {
      bg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      value: 'text-purple-300',
      trend: 'text-purple-400'
    },
    purple: {
      bg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      value: 'text-purple-300',
      trend: 'text-purple-400'
    },
    red: {
      bg: 'bg-red-500/20',
      icon: 'text-red-400',
      value: 'text-red-300',
      trend: 'text-red-400'
    },
    gray: {
      bg: 'bg-gray-500/20',
      icon: 'text-gray-400',
      value: 'text-gray-300',
      trend: 'text-gray-400'
    }
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 relative z-10">
            <div className={`w-10 h-10 ${classes.bg} backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20`}>
              <Icon className={`w-5 h-5 ${classes.icon}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white font-dm-sans">
                {title}
              </h3>
              <p className="text-xs text-white/60 font-dm-sans mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex items-end justify-between relative z-10">
            <div>
              <p className={`text-2xl font-bold font-dm-sans ${classes.value}`}>
                {value}
              </p>
            </div>
            
            {trend && (
              <div className={`text-xs font-medium ${classes.trend} flex items-center space-x-1`}>
                {trend.direction === 'up' && (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>+{trend.value}</span>
                  </>
                )}
                {trend.direction === 'down' && (
                  <>
                    <TrendingUp className="w-3 h-3 rotate-180" />
                    <span>-{trend.value}</span>
                  </>
                )}
                {trend.direction === 'neutral' && (
                  <span>{trend.value}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KPIStrip: React.FC = () => {
  // Mock data - in real app this would come from API/database
  const kpiData = [
    {
      title: 'Active Listings',
      value: 24,
      subtitle: 'Properties live',
      icon: Home,
      trend: { direction: 'up' as const, value: '3' },
      color: 'blue' as const
    },
    {
      title: 'New Offers Today',
      value: 7,
      subtitle: 'Buyer activity',
      icon: TrendingUp,
      trend: { direction: 'up' as const, value: '2' },
      color: 'green' as const
    },
    {
      title: 'Awaiting Verification',
      value: 12,
      subtitle: 'Offers to review',
      icon: Clock,
      trend: { direction: 'neutral' as const, value: 'No change' },
      color: 'purple' as const
    },
    {
      title: 'Under Offer (STC)',
      value: 8,
      subtitle: 'Accepted offers',
      icon: CheckCircle2,
      trend: { direction: 'up' as const, value: '1' },
      color: 'purple' as const
    },
    {
      title: 'Avg. Days to Accept',
      value: '14.2',
      subtitle: 'Performance metric',
      icon: Calendar,
      trend: { direction: 'down' as const, value: '2.1' },
      color: 'gray' as const
    },
    {
      title: 'Compliance Flags',
      value: 3,
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      trend: { direction: 'down' as const, value: '1' },
      color: 'red' as const
    }
  ];

  return (
    <div className="px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
              trend={kpi.trend}
              color={kpi.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIStrip;
