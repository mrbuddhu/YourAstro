-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create astrologer_profiles table
CREATE TABLE IF NOT EXISTS public.astrologer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience INTEGER NOT NULL,
  specialties TEXT[] NOT NULL,
  languages TEXT[] NOT NULL,
  bio TEXT,
  price_per_min DECIMAL(10,2) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_online BOOLEAN NOT NULL DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  avatar_url TEXT,
  documents_url TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for astrologer_profiles
ALTER TABLE public.astrologer_profiles ENABLE ROW LEVEL SECURITY;

-- Allow astrologers to view their own profile
CREATE POLICY "Astrologers can view their own profile"
  ON public.astrologer_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow astrologers to update their own profile
CREATE POLICY "Astrologers can update their own profile"
  ON public.astrologer_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow astrologers to insert their own profile
CREATE POLICY "Astrologers can insert their own profile"
  ON public.astrologer_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow all users to view verified astrologer profiles (for browsing)
CREATE POLICY "Users can view verified astrologer profiles"
  ON public.astrologer_profiles
  FOR SELECT
  USING (is_verified = true);

-- Create RLS policies for wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own transactions
CREATE POLICY "Users can view their own transactions"
  ON public.wallet_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own transactions
CREATE POLICY "Users can insert their own transactions"
  ON public.wallet_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_astrologer_profiles_email ON public.astrologer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_astrologer_profiles_verified ON public.astrologer_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_astrologer_profiles_online ON public.astrologer_profiles(is_online);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at);

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.astrologer_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions; 