import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://<project>.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0enZta2F6bXpxYmFmd3VybXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxMDg0MDIsImV4cCI6MjAwNDY4NDQwMn0.Vria0W84EL1WiqstS_zeFkEPcFG08TG-0FGiTIjyQNU')
