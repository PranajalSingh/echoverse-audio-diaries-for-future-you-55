
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bxuaqftpjagtvhtwqdym.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dWFxZnRwamFndHZodHdxZHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzE3MDMsImV4cCI6MjA2NDEwNzcwM30.ats7jpVTYGVhRBHCK_lyLMlfSvGIWuc1KTf-T9eccak"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
