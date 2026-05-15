import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://gnhsfrwixhhcdsbyyqhg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNmcndpeGhoY2RzYnl5cWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTcwOTAsImV4cCI6MjA4ODU5MzA5MH0.ff0jyDlmN-Er6Pykp2BGt3wNNYMsv5sYNv6K5vX4w38';

export const supabase = createClient(supabaseUrl, supabaseKey);
