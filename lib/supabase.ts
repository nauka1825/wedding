import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Template = 'romantic' | 'luxury' | 'bohemian' | 'azure' | 'sage'| 'blush'| 'midnight' | 'terracotta'

export type Wedding = {
  id: string
  male_name: string
  female_name: string
  wedding_date: string | null
  venue_name: string | null
  venue_address: string | null
  organizer: string | null
  phone: string | null
  template: Template
  main_photo_url: string | null
  gallery_urls: string[] | null
  photo3_url: string | null
  photo4_url: string | null
  photo5_url: string | null
  description1: string | null
  description2: string | null
  link1: string | null
  link2: string | null
  extra1: string | null
  extra2: string | null
  extra3: string | null
  extra4: string | null
  extra5: string | null
  created_at: string
   latitude: number | null;
  longitude: number | null;
}

export async function uploadImage(file: File, path: string): Promise<string | null> {
  const { error } = await supabase.storage
    .from('wedding-images')
    .upload(path, file, { upsert: true })
  if (error) { console.error(error); return null }
  const { data } = supabase.storage
    .from('wedding-images')
    .getPublicUrl(path)
  return data.publicUrl
}

export function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('T')[0].split('-')
  const months = [
    'қаңтардың', 'ақпанның', 'наурыздың', 'сәуірдің', 'мамырдың', 'маусымның',
    'шілденің', 'тамыздың', 'қыркүйектің', 'қазанның', 'қарашаның', 'желтоқсанның'
  ]
  return `${year} жылы ${months[parseInt(month) - 1]} ${parseInt(day)} күні`
}
