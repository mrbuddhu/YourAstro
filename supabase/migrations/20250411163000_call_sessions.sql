
-- Create call_sessions table
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'active', 'ended', 'missed')),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create RLS policies for call_sessions
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own call sessions
CREATE POLICY "Users can view their own call sessions"
  ON public.call_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own call sessions
CREATE POLICY "Users can insert their own call sessions"
  ON public.call_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own call sessions
CREATE POLICY "Users can update their own call sessions"
  ON public.call_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
