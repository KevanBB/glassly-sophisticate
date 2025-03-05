
import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

interface Match {
  id: number;
  name: string;
  type: string;
  compatibility: number;
  avatar: string;
}

interface MatchesCardProps {
  matches: Match[];
}

const MatchesCard = ({ matches }: MatchesCardProps) => {
  return (
    <DashboardCard 
      title="Top Matches" 
      icon={<Users size={18} />}
      action={<span>View all</span>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.length === 0 ? (
          <p className="text-center text-white/50 py-4 col-span-3">No matches found</p>
        ) : (
          matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex flex-col items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand mb-2">
                  <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-0 bg-brand text-xs text-white rounded-full w-6 h-6 flex items-center justify-center border border-dark">
                  {match.type[0]}
                </div>
              </div>
              
              <p className="text-sm font-medium text-white truncate max-w-full">
                {match.name}
              </p>
              
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Compatibility</span>
                  <span>{match.compatibility}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-brand h-1.5 rounded-full" 
                    style={{ width: `${match.compatibility}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default MatchesCard;
