import { createClient } from '@supabase/supabase-js'

const accessKey = "b101d1907fa3fad3c04e9cf78d827506"


const supabaseUrl = "https://owoidjkagijmwrgkiauc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b2lkamthZ2lqbXdyZ2tpYXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc1MDAsImV4cCI6MjA2NTU5MzUwMH0.EJZgfj2YabvyTDHQWKknRF-UMuLCLuwzRC7neoieEC8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)