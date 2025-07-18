/*
  # Create users and pickups tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `phone` (text, unique)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `pickups`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `date` (date)
      - `time` (time)
      - `address` (text)
      - `scrap_types` (text)
      - `estimated_weight` (numeric)
      - `remarks` (text)
      - `status` (text, default 'scheduled')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `scrap_rates`
      - `id` (uuid, primary key)
      - `item_name` (text)
      - `rate_per_kg` (numeric)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  name text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  address text NOT NULL,
  scrap_types text NOT NULL,
  estimated_weight numeric NOT NULL,
  remarks text DEFAULT '',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scrap_rates table
CREATE TABLE IF NOT EXISTS scrap_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text UNIQUE NOT NULL,
  rate_per_kg numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_rates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (phone = current_setting('app.current_user_phone', true));

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (phone = current_setting('app.current_user_phone', true));

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Pickups policies
CREATE POLICY "Users can read own pickups"
  ON pickups
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE phone = current_setting('app.current_user_phone', true)
  ));

CREATE POLICY "Users can insert own pickups"
  ON pickups
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE phone = current_setting('app.current_user_phone', true)
  ));

CREATE POLICY "Users can update own pickups"
  ON pickups
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE phone = current_setting('app.current_user_phone', true)
  ));

-- Scrap rates policies (read-only for all authenticated users)
CREATE POLICY "Anyone can read scrap rates"
  ON scrap_rates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default scrap rates
INSERT INTO scrap_rates (item_name, rate_per_kg) VALUES
  ('Newspaper', 14),
  ('Cardboard', 8),
  ('Plastic', 8),
  ('Metal', 104),
  ('Glass', 6),
  ('Aluminum', 120),
  ('Copper', 450),
  ('Brass', 280)
ON CONFLICT (item_name) DO NOTHING;