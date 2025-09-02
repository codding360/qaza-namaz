-- Supabase Database Schema for Namaz Profile App

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Create prayer_stats table
CREATE TABLE IF NOT EXISTS prayer_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prayer_name TEXT NOT NULL,
  skipped_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, prayer_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_prayer_stats_user_id ON prayer_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_stats_user_prayer ON prayer_stats(user_id, prayer_name);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);



-- Prayer stats policies
CREATE POLICY "Users can view own prayer stats" ON prayer_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer stats" ON prayer_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer stats" ON prayer_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to increment/decrement values
CREATE OR REPLACE FUNCTION increment(value INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN value + 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to add/subtract values from prayer stats
CREATE OR REPLACE FUNCTION update_prayer_count(user_id_param UUID, prayer_name_param TEXT, delta INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE prayer_stats 
  SET skipped_count = GREATEST(0, skipped_count + delta)
  WHERE user_id = user_id_param AND prayer_name = prayer_name_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle user signup with proper permissions
CREATE OR REPLACE FUNCTION handle_user_signup(
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_birth_year INTEGER,
  user_gender TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Insert user profile
  INSERT INTO users (id, email, first_name, last_name, birth_year, gender)
  VALUES (user_id, user_email, user_first_name, user_last_name, user_birth_year, user_gender);
  
  -- Calculate initial skipped prayers based on age and gender
  -- Formula: (current_year - (birth_year + prayer_start_age)) * 365
  -- Prayer start age: 12 for males, 9 for females
  DECLARE
    current_year INTEGER := EXTRACT(YEAR FROM NOW());
    prayer_start_age INTEGER;
    skipped_years INTEGER;
    initial_skipped_count INTEGER;
  BEGIN
    -- Set prayer start age based on gender
    prayer_start_age := CASE 
      WHEN user_gender = 'male' THEN 12
      WHEN user_gender = 'female' THEN 9
      ELSE 12 -- default to male age
    END;
    
    skipped_years := GREATEST(0, current_year - (user_birth_year + prayer_start_age));
    initial_skipped_count := skipped_years * 365; -- 5 prayers per day
    
    -- Insert prayer stats for each prayer type with calculated initial skipped count
    INSERT INTO prayer_stats (user_id, prayer_name, skipped_count)
    VALUES 
      (user_id, 'Багымдат', initial_skipped_count),
      (user_id, 'Бешим', initial_skipped_count),
      (user_id, 'Аср', initial_skipped_count),
      (user_id, 'Шам', initial_skipped_count),
      (user_id, 'Куптан', initial_skipped_count),
      (user_id, 'Витр Важиб', initial_skipped_count);
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



CREATE TRIGGER update_prayer_stats_updated_at
  BEFORE UPDATE ON prayer_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
