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
  video_url: string | null
  cover_url: string | null
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
// Unified file upload
// ============================================
type UploadFolder = 'images' | 'videos' | 'covers'

export async function uploadFile(file: File, folder: UploadFolder = 'images'): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await client().storage
    .from('ourspace-images')
    .upload(fileName, file)

  if (error) {
    if (error.message.includes('exceeds')) {
      throw new Error('哎呀，文件太重了，没传上去~')
    }
    throw new Error(error.message)
  }

  const { data: { publicUrl } } = client().storage
    .from('ourspace-images')
    .getPublicUrl(fileName)

  return publicUrl
}

// ============================================
// Extract first video frame as JPEG Blob
// ============================================
export function extractVideoFrame(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.src = url

    video.addEventListener('loadeddata', () => {
      video.currentTime = 0.1
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        resolve(null)
        return
      }
      ctx.drawImage(video, 0, 0)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve(blob)
        },
        'image/jpeg',
        0.85
      )
    })

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      resolve(null)
    })

    video.load()
  })
}

// ============================================
// Storage delete helper
// ============================================
async function deleteStorageFileByUrl(url: string) {
  if (!url || url.startsWith('/')) return
  const bucket = 'ourspace-images'
  const parts = url.split('/')
  const key = parts.slice(parts.indexOf(bucket) + 1).join('/')
  if (!key) return
  await client().storage.from(bucket).remove([key])
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
  updates: Partial<Pick<GalleryPost, 'image_url' | 'video_url' | 'cover_url' | 'date' | 'description'>>
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
    .select('image_url, video_url, cover_url')
    .eq('id', id)
    .single()

  if (fetchErr) throw new Error(fetchErr.message)

  if (data) {
    await Promise.all([
      deleteStorageFileByUrl(data.image_url),
      data.video_url ? deleteStorageFileByUrl(data.video_url) : Promise.resolve(),
      data.cover_url ? deleteStorageFileByUrl(data.cover_url) : Promise.resolve(),
    ])
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
