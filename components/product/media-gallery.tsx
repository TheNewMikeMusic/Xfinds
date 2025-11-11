'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface MediaGalleryProps {
  cover: string
  gallery: string[]
  title: string
}

export function MediaGallery({ cover, gallery, title }: MediaGalleryProps) {
  const t = useTranslations('product')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const images = [cover, ...gallery]
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="glass overflow-hidden relative group cursor-zoom-in">
        <motion.div
          className="relative aspect-square"
          whileHover={shouldReduceMotion ? {} : { scale: isZoomed ? 1 : 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={images[selectedIndex] || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <button
            className="absolute top-4 right-4 p-2 rounded-full glass border-blue-600/30 bg-gray-800/80 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
            aria-label={isZoomed ? t('zoomOut') : t('zoomIn')}
          >
            {isZoomed ? (
              <ZoomOut className="h-5 w-5" />
            ) : (
              <ZoomIn className="h-5 w-5" />
            )}
          </button>
        </motion.div>
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                selectedIndex === index
                  ? 'border-blue-500 scale-105'
                  : 'border-transparent hover:border-blue-500/50'
              }`}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              aria-label={t('viewImage', { title, index: index + 1 })}
            >
              <Image
                src={image || '/placeholder.jpg'}
                alt={`${title} - ${t('viewImage', { title, index: index + 1 })}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.9 }}
              animate={shouldReduceMotion ? {} : { scale: 1 }}
              exit={shouldReduceMotion ? {} : { scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex] || '/placeholder.jpg'}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 backdrop-blur-xl hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={() => setIsZoomed(false)}
                aria-label={t('close')}
              >
                <ZoomOut className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
