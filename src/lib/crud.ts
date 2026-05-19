import { getSupabaseClient } from './supabase'

export interface Post {
  id: string
  image_url: string
  content: string
  created_at: string
  updated_at: string
}

function client() {
  try {
    return getSupabaseClient()
  } catch {
    throw new Error('Database not configured yet. Please set up environment variables.')
  }
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await client()
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updatePost(id: string, updates: Partial<Pick<Post, 'image_url' | 'content'>>) {
  const { error } = await client()
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await client().storage
    .from('ourspace-images')
    .upload(filePath, file)

  if (uploadError) {
    if (uploadError.message.includes('exceeds')) {
      throw new Error('哎呀，照片太重了，没传上去~')
    }
    throw new Error(uploadError.message)
  }

  const { data: { publicUrl } } = client().storage
    .from('ourspace-images')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function createPost(): Promise<Post> {
  const { data, error } = await client()
    .from('posts')
    .insert({ image_url: '', content: 'Write something sweet here...' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteImage(url: string) {
  const path = url.split('/').pop()
  if (!path) return
  await client().storage.from('ourspace-images').remove([path])
}
