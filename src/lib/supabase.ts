import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (bypasses RLS)
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

// Helper function to upload image to Supabase storage
export const uploadImage = async (file: File, bucket: string = 'listings') => {
  // Check file size (1MB limit)
  const maxSize = 1 * 1024 * 1024; // 1MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 1MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Use service role client if available, otherwise use regular client
  const client = supabaseServiceRole || supabase;
  
  const { data, error } = await client.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  // Get public URL (always use regular client for public URLs)
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: data.path,
    publicUrl
  };
};
