'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import CuteCard from '@/components/CuteCard'
import SweetButton from '@/components/SweetButton'
import PhotoFrame from '@/components/PhotoFrame'
import LoveTimer from '@/components/LoveTimer'
import AdminActions from '@/components/AdminActions'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import LoginModal from '@/components/LoginModal'
import CreatePostModal from '@/components/CreatePostModal'
import FloatingAddButton from '@/components/FloatingAddButton'
import CuteAlert from '@/components/CuteAlert'
import { useAuth } from '@/context/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'
import { getPosts, updatePost, createPost, Post } from '@/lib/crud'
import {
  fetchGallery, updateGalleryPost, deleteGalleryPost,
  fetchMilestones, updateMilestone, deleteMilestone,
  GalleryPost, Milestone,
} from '@/lib/supabase-api'
import {
  Heart, Camera, Sparkles, Save, Plus, LogIn, Unlock, Loader, AlertTriangle, Calendar, Star,
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [gallery, setGallery] = useState<GalleryPost[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' })

  // Editing state
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editingGallery, setEditingGallery] = useState<string | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<Record<string, string>>({})
  const [editDate, setEditDate] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'gallery' | 'milestone'; id: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showMsg = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ open: true, message: msg, type })
  }, [])

  const loadAll = useCallback(async () => {
    try {
      const [p, g, m] = await Promise.all([getPosts(), fetchGallery(), fetchMilestones()])
      setPosts(p)
      setGallery(g)
      setMilestones(m)
    } catch (err: any) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    try {
      getSupabaseClient()
      loadAll()
    } catch (err: any) {
      setLoadError(err.message)
      setLoading(false)
    }
  }, [loadAll])

  // === Posts handlers ===
  const handleSavePost = async (id: string) => {
    setSavingId(id)
    try {
      await updatePost(id, { content: editContent[id] })
      setEditingPost(null)
      showMsg('Saved! 💕')
      await loadAll()
    } catch (e: any) { showMsg(e.message, 'error') }
    finally { setSavingId(null) }
  }

  // === Gallery handlers ===
  const handleSaveGallery = async (id: string) => {
    setSavingId(id)
    try {
      await updateGalleryPost(id, { description: editContent[id], date: editDate[id] })
      setEditingGallery(null)
      showMsg('Photo updated! 📸')
      await loadAll()
    } catch (e: any) { showMsg(e.message, 'error') }
    finally { setSavingId(null) }
  }

  const handleGalleryImageChange = async (id: string, url: string) => {
    try {
      await updateGalleryPost(id, { image_url: url })
      showMsg('Photo replaced! 📸')
      await loadAll()
    } catch (e: any) { showMsg(e.message, 'error') }
  }

  // === Milestone handlers ===
  const handleSaveMilestone = async (id: string) => {
    setSavingId(id)
    try {
      await updateMilestone(id, {
        title: editContent[id + '_title'],
        description: editContent[id + '_desc'],
        date: editDate[id],
      })
      setEditingMilestone(null)
      showMsg('Milestone updated! ✨')
      await loadAll()
    } catch (e: any) { showMsg(e.message, 'error') }
    finally { setSavingId(null) }
  }

  // === Delete handler ===
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'post') {
        await getSupabaseClient().from('posts').delete().eq('id', deleteTarget.id)
      } else if (deleteTarget.type === 'gallery') {
        await deleteGalleryPost(deleteTarget.id)
      } else {
        await deleteMilestone(deleteTarget.id)
      }
      showMsg('Deleted ✨')
      setDeleteTarget(null)
      await loadAll()
    } catch (e: any) { showMsg(e.message, 'error') }
    finally { setDeleting(false) }
  }

  // === Edit mode starters ===
  const startEditPost = (p: Post) => {
    setEditingPost(p.id)
    setEditContent(prev => ({ ...prev, [p.id]: p.content }))
  }
  const startEditGallery = (g: GalleryPost) => {
    setEditingGallery(g.id)
    setEditContent(prev => ({ ...prev, [g.id]: g.description }))
    setEditDate(prev => ({ ...prev, [g.id]: g.date }))
  }
  const startEditMilestone = (m: Milestone) => {
    setEditingMilestone(m.id)
    setEditContent(prev => ({ ...prev, [m.id + '_title']: m.title, [m.id + '_desc']: m.description }))
    setEditDate(prev => ({ ...prev, [m.id]: m.date }))
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100/50 flex items-center justify-center p-4">
        <CuteCard className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-pink-500 mb-2">Oops! Something needs setup</h2>
          <p className="text-sm text-gray-600">{loadError}</p>
        </CuteCard>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100/50 py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div>
            {user && (
              <button onClick={async () => { await getSupabaseClient().auth.signOut() }}
                className="text-xs text-pink-400 underline underline-offset-2">
                Sign out
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <span className="flex items-center gap-1 text-xs text-pink-400 bg-white/60 px-3 py-1.5 rounded-full">
                <Unlock className="w-3 h-3" /> Edit Mode
              </span>
            ) : (
              <SweetButton variant="secondary" onClick={() => setLoginOpen(true)} className="text-xs px-4 py-2">
                <span className="flex items-center gap-1"><LogIn className="w-3 h-3" /> Sign In</span>
              </SweetButton>
            )}
          </div>
        </div>

        {/* Love Timer */}
        <LoveTimer />

        {/* Welcome */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-500 mb-2">OurSpace</h1>
          <p className="text-gray-600">Our special place 💕</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <Heart className="w-10 h-10 text-pink-300" />
            </motion.div>
          </div>
        ) : (
          <>
            {/* ====== Milestones Section ====== */}
            {milestones.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-bold text-pink-500 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" /> 纪念日
                </h2>
                {milestones.slice(0, 1).map(ms => (
                  <CuteCard key={ms.id} className="relative">
                    {user && (
                      <div className="absolute top-3 right-3 z-10">
                        <AdminActions
                          editing={editingMilestone === ms.id}
                          saving={savingId === ms.id}
                          onEdit={() => startEditMilestone(ms)}
                          onDelete={() => setDeleteTarget({ type: 'milestone', id: ms.id })}
                        />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{ms.icon}</span>
                      <div className="flex-1 min-w-0">
                        {editingMilestone === ms.id ? (
                          <div className="space-y-2">
                            <input type="date" value={editDate[ms.id] || ''}
                              onChange={e => setEditDate(p => ({ ...p, [ms.id]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white/60 
                                         focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
                            <input type="text" value={editContent[ms.id + '_title'] || ''}
                              onChange={e => setEditContent(p => ({ ...p, [ms.id + '_title']: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white/60 
                                         focus:outline-none focus:ring-2 focus:ring-pink-300 font-semibold" />
                            <textarea value={editContent[ms.id + '_desc'] || ''}
                              onChange={e => setEditContent(p => ({ ...p, [ms.id + '_desc']: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white/60 
                                         focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm resize-none"
                              rows={2} />
                            <SweetButton onClick={() => handleSaveMilestone(ms.id)} disabled={savingId === ms.id}>
                              <span className="flex items-center gap-1 text-sm">
                                {savingId === ms.id ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {savingId === ms.id ? 'Saving...' : 'Save'}
                              </span>
                            </SweetButton>
                          </div>
                        ) : (
                          <>
                            <p className="text-pink-300 text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {ms.date}
                            </p>
                            <h3 className="font-bold text-gray-800">{ms.title}</h3>
                            <p className="text-gray-600 text-sm">{ms.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CuteCard>
                ))}
              </section>
            )}

            {/* ====== Posts Section ====== */}
            {posts.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-bold text-pink-500 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> 甜蜜宣言
                </h2>
                {posts.map(post => (
                  <CuteCard key={post.id} className="mb-4 text-center relative">
                    {user && (
                      <div className="absolute top-3 right-3 z-10">
                        <AdminActions
                          editing={editingPost === post.id}
                          saving={savingId === post.id}
                          onEdit={() => startEditPost(post)}
                          onDelete={() => setDeleteTarget({ type: 'post', id: post.id })}
                        />
                      </div>
                    )}
                    {editingPost === post.id ? (
                      <div className="space-y-2">
                        <textarea value={editContent[post.id] || ''}
                          onChange={e => setEditContent(p => ({ ...p, [post.id]: e.target.value }))}
                          className="w-full text-xl text-gray-700 italic text-center bg-pink-50/50 rounded-xl p-4 
                                     border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                          rows={3} />
                        <SweetButton onClick={() => handleSavePost(post.id)} disabled={savingId === post.id}>
                          <span className="flex items-center gap-1 text-sm">
                            {savingId === post.id ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {savingId === post.id ? 'Saving...' : 'Save'}
                          </span>
                        </SweetButton>
                      </div>
                    ) : (
                      <p className="text-xl text-gray-700 italic">{post.content}</p>
                    )}
                    <div className="mt-3 flex justify-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                      <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    </div>
                  </CuteCard>
                ))}
              </section>
            )}

            {/* ====== Gallery Section ====== */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-pink-500 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" /> 照片墙
              </h2>
              {gallery.length === 0 ? (
                <p className="text-center text-pink-300 italic">No photos yet...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.slice(0, 6).map(g => (
                    <div key={g.id} className="relative group">
                      {user && (
                        <div className="absolute top-2 right-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <AdminActions
                            editing={editingGallery === g.id}
                            saving={savingId === g.id}
                            onEdit={() => startEditGallery(g)}
                            onDelete={() => setDeleteTarget({ type: 'gallery', id: g.id })}
                          />
                        </div>
                      )}
                      <PhotoFrame
                        src={g.image_url || '/placeholder.svg'}
                        alt={g.description}
                        editable={!!user}
                        videoUrl={g.video_url}
                        coverUrl={g.cover_url}
                        onImageChange={url => handleGalleryImageChange(g.id, url)}
                      />
                      {editingGallery === g.id ? (
                        <div className="mt-2 space-y-2">
                          <input type="date" value={editDate[g.id] || ''}
                            onChange={e => setEditDate(p => ({ ...p, [g.id]: e.target.value }))}
                            className="w-full px-2 py-1 rounded-lg border border-pink-200 bg-white/60 
                                       focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs" />
                          <input type="text" value={editContent[g.id] || ''}
                            onChange={e => setEditContent(p => ({ ...p, [g.id]: e.target.value }))}
                            className="w-full px-2 py-1 rounded-lg border border-pink-200 bg-white/60 
                                       focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs"
                            placeholder="Description" />
                          <button onClick={() => handleSaveGallery(g.id)}
                            className="w-full text-xs cute-button py-1">
                            {savingId === g.id ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center mt-1">{g.date} · {g.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadAll} />
      {user && <FloatingAddButton onClick={() => setCreateOpen(true)} />}
      <CuteAlert
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      />
    </main>
  )
}
