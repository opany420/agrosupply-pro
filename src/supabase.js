import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xdhtdqiqoqcimlomrleu.supabase.co'
const supabaseKey = 'sb_publishable_zvmErwzMooP3H9mwazb57w_yuRbroAH'

export const supabase = createClient(supabaseUrl, supabaseKey)