import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from './DashboardCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';

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
  const [recipientId, setRecipientId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRecipient(value);
    
    const recipientMap: Record<string, string> = {
      'DomMaster97': '5f8d0a1e-d8a6-4d3c-9d7f-12a4b5c6d7e8',
      'SubLover23': '6a9b8c7d-6e5f-4d3c-b2a1-0f9e8d7c6b5a',
      'KinkExplorer': '7c6b5a4d-3e2f-1a9b-8c7d-6e5f4d3c2b1a'
    };
    
    setRecipientId(recipientMap[value] || '');
  };

  const handlePaymentSuccess = () => {
    setTributeAmount('');
    setTributeMessage('');
    setRecipient('');
    setRecipientId('');
    setShowTributeForm(false);
    
    const newTribute = {
      id: Date.now(),
      amount: Number(tributeAmount),
      recipient: recipient,
      date: new Date().toLocaleDateString(),
      avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    };
    
    recentTributes.unshift(newTribute);
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
            
            <div className="space-y-2">
              <label className="text-sm text-white/70">Recipient</label>
              <select 
                value={recipient}
                onChange={handleRecipientChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              >
                <option value="">Select recipient</option>
                <option value="DomMaster97">DomMaster97</option>
                <option value="SubLover23">SubLover23</option>
                <option value="KinkExplorer">KinkExplorer</option>
              </select>
            </div>
            
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
            
            <div className="space-y-2">
              <label className="text-sm text-white/70">Message (Optional)</label>
              <textarea
                value={tributeMessage}
                onChange={(e) => setTributeMessage(e.target.value)}
                placeholder="Add a message..."
                className="w-full p-3 glass-input rounded-lg resize-none h-20"
              />
            </div>
            
            {recipient && recipientId && tributeAmount ? (
              <PaymentProcessor
                creatorId={recipientId}
                amount={Number(tributeAmount)}
                tributeType="tribute"
                onSuccess={handlePaymentSuccess}
                onError={(error) => toast.error(error)}
              />
            ) : (
              <Button
                disabled={true}
                className="w-full opacity-50"
              >
                <Send size={16} className="mr-2" />
                Select recipient and amount
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTributeForm(true)}
              className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center justify-center"
            >
              <DollarSign size={16} className="mr-2" />
              Send a Tribute
            </motion.button>
            
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
