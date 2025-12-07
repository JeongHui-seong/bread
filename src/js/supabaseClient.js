// CDN으로 로드된 supabase 사용 (index.html에서 로드)
const SUPABASE_URL = 'https://nmaqrwjjobssxuukhuqo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_o7ysEcNxFCtuVHvDT_vh0A_GQjz2ZUI';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;