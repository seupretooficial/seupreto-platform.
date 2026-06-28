import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yjtfmsjjrqzgrnxuxmcd.supabase.co'
const supabaseAnonKey = 'sb_publishable_ga-5tTvyYLRvH1DZ1W5ypw_tuXK50DQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)