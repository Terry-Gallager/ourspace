'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Star, Loader, Heart, ImagePlus } from 'lucide-react'
import { addGalleryPost, uploadImage, addMilestone } from '@/lib/supabase-api'
import { createPost } from '@/lib/crud'
import SweetButton from './SweetButton'
import CuteAlert from './CuteAlert'

type Tab = 'photo' | 'milestone'

interface CreatePostModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

const TODAY = new Date().toISOString().split('T')[0]

export default function CreatePostModal({ open, onClose, onCreated }: CreatePostModalProps) {
  const [tab, setTab] = useState<Tab>('photo')
  const [date, setDate] = useState(TODAY)
  const [description, setDescription] = useState('')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDesc, setMilestoneDesc] = useState('')
  const [milestoneIcon, setMilestoneIcon] = useState('💖')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' })
  const fileRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setDate(TODAY)
    setDescription('')
    setMilestoneTitle('')
    setMilestoneDesc('')
    setMilestoneIcon('💖')
    setImageFile(null)
    setImagePreview(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (tab === 'photo') {
        let imageUrl = ''
        if (imageFile) {
          imageUrl = await uploadImage(imageFile)
        }
        await addGalleryPost({ image_url: imageUrl, date, description })
        setAlert({ open: true, message: 'Photo posted! 📸', type: 'success' })
      } else {
        await addMilestone({ date, title: milestoneTitle, description: milestoneDesc, icon: milestoneIcon })
        setAlert({ open: true, message: 'Milestone added! ✨', type: 'success' })
      }
      resetForm()
      onCreated()
      setTimeout(onClose, 800)
    } catch (e: any) {
      setAlert({ open: true, message: e.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center 
                     bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl 
                       shadow-soft border border-pink-200/50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-pink-100">
              <h2 className="text-lg font-bold text-pink-500 flex items-center gap-2">
                <Heart className="w-5 h-5" /> New Memory
              </h2>
              <button onClick={onClose} className="text-pink-300 hover:text-pink-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-pink-100">
              {(['photo', 'milestone'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                    ${tab === t ? 'text-pink-500 border-b-2 border-pink-400 bg-pink-50/50' : 'text-gray-400'}`}
                >
                  {t === 'photo' ? <Camera className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                  {t === 'photo' ? '发照片' : '记纪念日'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Date */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">日期</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white/60 
                             focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
              </div>

              {tab === 'photo' ? (
                <>
                  {/* Image upload */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">照片</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-pink-200">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                        <button onClick={() => { setImageFile(null); setImagePreview(null) }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                          <X className="w-4 h-4 text-pink-400" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full h-36 rounded-2xl border-2 border-dashed border-pink-200 
                                   flex flex-col items-center justify-center gap-2 text-pink-300 
                                   hover:border-pink-400 hover:text-pink-400 transition-colors">
                        <ImagePlus className="w-8 h-8" />
                        <span className="text-sm">点击上传照片</span>
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">描述</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="记录这个瞬间..."
                      className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white/60 
                                 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm resize-none"
                      rows={3} />
                  </div>
                </>
              ) : (
                <>
                  {/* Icon picker */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">图标</label>
                    <div className="flex gap-2 flex-wrap">
                      {['💖', '💕', '🌹', '🎂', '✈️', '🏠', '💍', '🎄', '🌸', '🎉'].map(icon => (
                        <button key={icon} onClick={() => setMilestoneIcon(icon)}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all
                            ${milestoneIcon === icon ? 'bg-pink-100 ring-2 ring-pink-400 scale-110' : 'bg-pink-50 hover:bg-pink-100'}`}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">标题</label>
                    <input type="text" value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)}
                      placeholder="纪念日名称"
                      className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white/60 
                                 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">描述</label>
                    <textarea value={milestoneDesc} onChange={e => setMilestoneDesc(e.target.value)}
                      placeholder="写下这个日子的意义..."
                      className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white/60 
                                 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm resize-none"
                      rows={3} />
                  </div>
                </>
              )}

              {/* Submit */}
              <SweetButton onClick={handleSubmit} disabled={submitting}
                className="w-full flex items-center justify-center gap-2">
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                {submitting ? '发布中...' : '发布'}
              </SweetButton>
            </div>
          </motion.div>

          <CuteAlert open={alert.open} message={alert.message} type={alert.type}
            onClose={() => setAlert(prev => ({ ...prev, open: false }))} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
