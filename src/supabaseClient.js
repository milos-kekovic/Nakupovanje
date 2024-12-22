import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zkkenrvwwiywvxdogumj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpra2VucnZ3d2l5d3Z4ZG9ndW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzc2MzUsImV4cCI6MjA0ODkxMzYzNX0.ZatyYQBNUMvSCkGkEy4uaHmQrScffFfGQC_shQdPMTE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
