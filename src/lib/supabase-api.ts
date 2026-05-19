import { getSupabaseClient } from './supabase'

function client() {
  try {
    return getSupabaseClient()
  } catch {
    throw new Error('Database not configured. Please set environment variables.')
  }
}

// ============================================
// Types
// ============================================
export interface GalleryPost {
  id: string
  image_url: string
  date: string
  description: string
  created_at: string
}

export interface Milestone {
  id: string
  date: string
  title: string
  description: string
  icon: string
  created_at: string
}

// ============================================
// Image upload helper
// ============================================
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error } = await client().storage
    .from('ourspace-images')
    .upload(fileName, file)

  if (error) {
    if (error.message.includes('exceeds')) {
      throw new Error('哎呀，照片太重了，没传上去~')
    }
    throw new Error(error.message)
  }

  const { data: { publicUrl } } = client().storage
    .from('ourspace-images')
    .getPublicUrl(fileName)

  return publicUrl
}

async function deleteStorageImage(url: string) {
  if (!url || url.startsWith('/')) return
  const path = url.split('/').pop()
  if (!path) return
  await client().storage.from('ourspace-images').remove([path])
}

// ============================================
// Gallery Posts CRUD
// ============================================
export async function fetchGallery(): Promise<GalleryPost[]> {
  const { data, error } = await client()
    .from('gallery_posts')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function addGalleryPost(post: Omit<GalleryPost, 'id' | 'created_at'>): Promise<GalleryPost> {
  const { data, error } = await client()
    .from('gallery_posts')
    .insert(post)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateGalleryPost(
  id: string,
  updates: Partial<Pick<GalleryPost, 'image_url' | 'date' | 'description'>>
): Promise<void> {
  const { error } = await client()
    .from('gallery_posts')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteGalleryPost(id: string): Promise<void> {
  const { data, error: fetchErr } = await client()
    .from('gallery_posts')
    .select('image_url')
    .eq('id', id)
    .single()

  if (fetchErr) throw new Error(fetchErr.message)

  if (data?.image_url) {
    await deleteStorageImage(data.image_url)
  }

  const { error } = await client()
    .from('gallery_posts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ============================================
// Milestones CRUD
// ============================================
export async function fetchMilestones(): Promise<Milestone[]> {
  const { data, error } = await client()
    .from('milestones')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function addMilestone(ms: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> {
  const { data, error } = await client()
    .from('milestones')
    .insert(ms)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateMilestone(
  id: string,
  updates: Partial<Pick<Milestone, 'date' | 'title' | 'description' | 'icon'>>
): Promise<void> {
  const { error } = await client()
    .from('milestones')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await client()
    .from('milestones')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
