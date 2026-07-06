'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Loader } from 'lucide-react'

interface AdminActionsProps {
  onEdit: () => void
  onDelete: () => void
  className?: string
  editing?: boolean
  saving?: boolean
}

export default function AdminActions({
  onEdit,
  onDelete,
  className = '',
  editing = false,
  saving = false,
}: AdminActionsProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {!editing && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 
                     flex items-center justify-center text-pink-400 shadow-soft 
                     hover:bg-pink-50 transition-colors"
          title="Edit"
        >
          {saving ? (
            <Loader className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Pencil className="w-3.5 h-3.5" />
          )}
        </motion.button>
      )}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleDelete}
        disabled={deleting}
        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-red-200 
                   flex items-center justify-center text-red-400 shadow-soft 
                   hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Delete"
      >
        {deleting ? (
          <Loader className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </motion.button>
    </div>
  )
}
