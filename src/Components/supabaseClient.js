import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehkybpzimyptzvjlzwal.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoa3licHppbXlwdHp2amx6d2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzMyODIsImV4cCI6MjA2OTIwOTI4Mn0.SwNX9thiCaRpw-B68f0Bwj3KElOnIjdfv1033bFM4iI'
export const supabase = createClient(supabaseUrl, supabaseKey)
