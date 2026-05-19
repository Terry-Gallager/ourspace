'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CuteCard from '@/components/CuteCard'
import SweetButton from '@/components/SweetButton'
import PhotoFrame from '@/components/PhotoFrame'
import LoginModal from '@/components/LoginModal'
import CuteAlert from '@/components/CuteAlert'
import { useAuth } from '@/context/AuthContext'
import { getPosts, updatePost, createPost, Post } from '@/lib/crud'
import { Heart, Camera, Sparkles, Save, Plus, LogIn, Unlock, Loader, AlertTriangle } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' })
  const [editableContent, setEditableContent] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      getSupabaseClient()
      loadPosts()
    } catch (err: any) {
      setLoadError(err.message)
      setLoading(false)
    }
  }, [])

  const loadPosts = async () => {
    try {
      const data = await getPosts()
      setPosts(data)
      const contentMap: Record<string, string> = {}
      data.forEach(p => { contentMap[p.id] = p.content })
      setEditableContent(contentMap)
    } catch (err: any) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContent = async (postId: string) => {
    setSavingId(postId)
    try {
      await updatePost(postId, { content: editableContent[postId] })
      setAlert({ open: true, message: 'Saved! 💕', type: 'success' })
    } catch (err: any) {
      setAlert({ open: true, message: err.message, type: 'error' })
    } finally {
      setSavingId(null)
    }
  }

  const handleImageChange = async (postId: string, url: string) => {
    try {
      await updatePost(postId, { image_url: url })
      setAlert({ open: true, message: 'Photo updated! 📸', type: 'success' })
    } catch (err: any) {
      setAlert({ open: true, message: err.message, type: 'error' })
    }
  }

  const handleAddPost = async () => {
    setCreating(true)
    try {
      const newPost = await createPost()
      setPosts(prev => [newPost, ...prev])
      setEditableContent(prev => ({ ...prev, [newPost.id]: newPost.content }))
      setAlert({ open: true, message: 'New memory added! ✨', type: 'success' })
    } catch (err: any) {
      setAlert({ open: true, message: err.message, type: 'error' })
    } finally {
      setCreating(false)
    }
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100/50 flex items-center justify-center p-4">
        <CuteCard className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-pink-500 mb-2">Oops! Something needs setup</h2>
          <p className="text-sm text-gray-600 mb-4">{loadError}</p>
          <p className="text-xs text-gray-400">
            After configuring, refresh the page to try again.
          </p>
        </CuteCard>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100/50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div>
            {user && (
              <button
                onClick={async () => {
                  const supabase = getSupabaseClient()
                  await supabase.auth.signOut()
                }}
                className="text-xs text-pink-400 underline underline-offset-2"
              >
                Sign out
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <span className="flex items-center gap-1 text-xs text-pink-400 bg-white/60 px-3 py-1.5 rounded-full">
                <Unlock className="w-3 h-3" />
                Edit Mode
              </span>
            ) : (
              <SweetButton
                variant="secondary"
                onClick={() => setLoginOpen(true)}
                className="text-xs px-4 py-2"
              >
                <span className="flex items-center gap-1">
                  <LogIn className="w-3 h-3" />
                  Sign In
                </span>
              </SweetButton>
            )}
          </div>
        </div>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="w-16 h-16 text-pink-400 mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-pink-500 mb-4">
            Welcome to OurSpace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A special place just for us, where we keep our sweetest memories <span role="img" aria-label="heart">💕</span>
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-pink-300" />
            </motion.div>
          </div>
        ) : posts.length === 0 ? (
          <CuteCard className="mb-8 text-center">
            <Sparkles className="w-8 h-8 text-pink-300 mx-auto mb-3" />
            <p className="text-xl text-gray-700 italic mb-4">
              No memories yet... Start by adding your first one!
            </p>
            {user && (
              <SweetButton onClick={handleAddPost} disabled={creating}>
                <span className="flex items-center gap-2">
                  {creating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {creating ? 'Creating...' : 'Add First Memory'}
                </span>
              </SweetButton>
            )}
            {!user && (
              <p className="text-sm text-pink-300">Sign in to start adding memories</p>
            )}
          </CuteCard>
        ) : (
          posts.map((post) => (
            <CuteCard key={post.id} className="mb-8 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-8 h-8 text-pink-300 mx-auto mb-3" />

                {user ? (
                  <div className="space-y-2">
                    <textarea
                      value={editableContent[post.id] || ''}
                      onChange={(e) => setEditableContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="w-full text-xl text-gray-700 italic text-center bg-pink-50/50 rounded-xl p-4 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-center gap-2">
                      <SweetButton
                        onClick={() => handleSaveContent(post.id)}
                        disabled={savingId === post.id}
                      >
                        <span className="flex items-center gap-1 text-sm">
                          {savingId === post.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {savingId === post.id ? 'Saving...' : 'Save'}
                        </span>
                      </SweetButton>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl text-gray-700 italic">{post.content}</p>
                )}

                <div className="mt-4 flex justify-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                  <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                </div>
              </motion.div>
            </CuteCard>
          ))
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-pink-500 text-center mb-6 flex items-center justify-center gap-2">
            <Camera className="w-6 h-6" />
            Our Memories
            <Camera className="w-6 h-6" />
          </h2>
          {posts.length === 0 ? (
            <p className="text-center text-pink-300 italic">No photos yet...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PhotoFrame
                  key={post.id}
                  src={post.image_url || '/placeholder.svg'}
                  alt="Our memory"
                  editable={!!user}
                  onImageChange={(url) => handleImageChange(post.id, url)}
                />
              ))}
            </div>
          )}
        </div>

        {user && posts.length > 0 && (
          <div className="text-center mb-8">
            <SweetButton onClick={handleAddPost} disabled={creating}>
              <span className="flex items-center gap-2">
                {creating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {creating ? 'Creating...' : 'Add New Memory'}
              </span>
            </SweetButton>
          </div>
        )}

        <div className="text-center pb-8">
          <div className="inline-block cursor-pointer select-none">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 text-pink-300"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">Made with love</span>
            </motion.div>
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <CuteAlert
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ open: false, message: '', type: 'success' })}
      />
    </main>
  )
}
