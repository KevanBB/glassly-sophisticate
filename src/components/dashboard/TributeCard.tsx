
import React, { useState } from 'react';
import { CreditCard, DollarSign, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from './DashboardCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define preset amounts for quick selection
const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

interface TributeCardProps {
  recentTributes?: Array<{
    id: number;
    amount: number;
    recipient: string;
    date: string;
    avatar: string;
  }>;
}

const TributeCard = ({ 
  recentTributes = [] 
}: TributeCardProps) => {
  const [showTributeForm, setShowTributeForm] = useState(false);
  const [tributeAmount, setTributeAmount] = useState<number | string>('');
  const [tributeMessage, setTributeMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendTribute = () => {
    if (!tributeAmount || Number(tributeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!recipient) {
      toast.error('Please select a recipient');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Tribute of $${tributeAmount} sent to ${recipient}!`);
      
      // Reset form
      setTributeAmount('');
      setTributeMessage('');
      setRecipient('');
      setShowTributeForm(false);
    }, 1500);
  };

  return (
    <DashboardCard 
      title="Tributes" 
      icon={<DollarSign size={18} />}
      action={<span>History</span>}
    >
      <AnimatePresence mode="wait">
        {showTributeForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium">Send a Tribute</h4>
              <button 
                onClick={() => setShowTributeForm(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Recipient selector */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Recipient</label>
              <select 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              >
                <option value="">Select recipient</option>
                <option value="DomMaster97">DomMaster97</option>
                <option value="SubLover23">SubLover23</option>
                <option value="KinkExplorer">KinkExplorer</option>
              </select>
            </div>
            
            {/* Amount selector */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={tributeAmount}
                  onChange={(e) => setTributeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 glass-input rounded-lg"
                />
              </div>
              
              {/* Quick amount buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTributeAmount(amount)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md transition-all",
                      Number(tributeAmount) === amount 
                        ? "bg-brand text-white" 
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Message (Optional)</label>
              <textarea
                value={tributeMessage}
                onChange={(e) => setTributeMessage(e.target.value)}
                placeholder="Add a message..."
                className="w-full p-3 glass-input rounded-lg resize-none h-20"
              />
            </div>
            
            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendTribute}
              disabled={isProcessing}
              className={cn(
                "w-full py-2 rounded-lg font-medium flex items-center justify-center",
                "bg-gradient-to-r from-brand-dark to-brand text-white",
                "transition-all duration-300",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Tribute
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* New tribute button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTributeForm(true)}
              className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center justify-center"
            >
              <DollarSign size={16} className="mr-2" />
              Send a Tribute
            </motion.button>
            
            {/* Recent tributes list */}
            <div className="space-y-3">
              {recentTributes.length === 0 ? (
                <p className="text-center text-white/50 py-2">No recent tributes</p>
              ) : (
                recentTributes.map((tribute, index) => (
                  <motion.div
                    key={tribute.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center p-2 rounded-lg bg-white/5"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={tribute.avatar} alt={tribute.recipient} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {tribute.recipient}
                      </p>
                      <p className="text-xs text-white/60">
                        {tribute.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand">${tribute.amount}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardCard>
  );
};

export default TributeCard;
