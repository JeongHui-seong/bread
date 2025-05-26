import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://nmaqrwjjobssxuukhuqo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tYXFyd2pqb2Jzc3h1dWtodXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDg3NjcsImV4cCI6MjA2MzI4NDc2N30.ZRWQJm1-kse_CzEYlSq0QaeYyRRyNaWnezm0SjD2QAA');

export default supabase;