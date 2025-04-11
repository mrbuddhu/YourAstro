-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'ended')),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own chat sessions
CREATE POLICY "Users can view their own chat sessions"
  ON public.chat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own chat sessions
CREATE POLICY "Users can insert their own chat sessions"
  ON public.chat_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own chat sessions
CREATE POLICY "Users can update their own chat sessions"
  ON public.chat_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view messages from their chat sessions
CREATE POLICY "Users can view messages from their chat sessions"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = messages.chat_session_id
      AND user_id = auth.uid()
    )
  );

-- Allow users to insert messages in their chat sessions
CREATE POLICY "Users can insert messages in their chat sessions"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = messages.chat_session_id
      AND user_id = auth.uid()
    )
  );

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;