import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://riodlauzqywunnxjrgbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpb2RsYXV6cXl3dW5ueGpyZ2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzQ0NzksImV4cCI6MjA1MjgxMDQ3OX0.yhLxbnEp-OJBAM0lISFHn7Ev3F77eTmnDZgE1H4RV9A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
