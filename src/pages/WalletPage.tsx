import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Plus, History } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WalletPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch wallet balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setBalance(profile.wallet_balance || 0);
      }

      // Fetch recent transactions
      const { data: txns, error: txnError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (txns) {
        setTransactions(txns);
      }
    };

    fetchWalletData();
  }, [navigate]);

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Start a transaction to update wallet balance and add transaction record
      const newBalance = balance + Number(amount);
      
      const { data: profile, error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Record the transaction
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: session.user.id,
          amount: Number(amount),
          type: 'credit',
          description: 'Added funds to wallet',
          status: 'completed'
        });

      if (txnError) throw txnError;

      setBalance(newBalance);
      setAmount("");
      
      toast({
        title: "Funds added successfully",
        description: `₹${amount} has been added to your wallet`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error adding funds",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            <span className="astro-gradient-text">Wallet</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-astro-purple" />
                  Current Balance
                </CardTitle>
                <CardDescription>Your available balance for consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">
                  <span className="text-astro-gold">₹</span>
                  {balance}
                </div>
                <p className="text-sm text-foreground/70">
                  Use this balance for astrology consultations
                </p>
              </CardContent>
            </Card>

            {/* Add Funds Card */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-astro-purple" />
                  Add Funds
                </CardTitle>
                <CardDescription>Add money to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="celestial-input mt-1"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        className="border-astro-purple/30 hover:bg-astro-purple/10"
                        onClick={() => setAmount(amt.toString())}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full star-button" 
                    onClick={handleAddFunds}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Add Funds"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="cosmic-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-astro-purple" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your recent wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-foreground/70">
                          {new Date(txn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-lg font-medium ${
                        txn.type === 'credit' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-foreground/70 py-8">
                  No transactions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WalletPage; 