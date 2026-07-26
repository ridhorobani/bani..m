import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';
import { compressImageFile } from '../utils/storage';
import { translations, Language } from '../data/translations';
import { Play, Grid, ChevronLeft, ChevronRight, ArrowRight, Maximize2, MapPin, Calendar, Trash2, Upload, RefreshCw } from 'lucide-react';

interface GallerySceneProps {
  photos: PhotoItem[];
  lang: Language;
  onAddPhoto: (photo: PhotoItem) => void;
  onRemovePhoto: (id: string) => void;
  onReplacePhoto: (id: string, updatedPhoto: PhotoItem) => void;
  onNext: () => void;
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  photos,
  lang,
  onAddPhoto,
  onRemovePhoto,
  onReplacePhoto,
  onNext,
}) => {
  const t = translations[lang].gallery;
  const [viewMode, setViewMode] = useState<'polaroid' | 'slideshow' | 'grid'>('polaroid');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % (photos.length || 1));
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + photos.length) % (photos.length || 1));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64Url = await compressImageFile(file, 1200, 1200, 0.8);
      onAddPhoto({
        id: 'file_' + Date.now(),
        url: base64Url,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        date: lang === 'en' ? 'New Memory' : 'Kenangan Baru',
        rotation: (Math.random() - 0.5) * 8,
      });
    } catch (err) {
      console.error('Failed uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplaceUpload = async (e: React.ChangeEvent<HTMLInputElement>, photo: PhotoItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setReplacingId(photo.id);
      const base64Url = await compressImageFile(file, 1200, 1200, 0.8);
      onReplacePhoto(photo.id, {
        ...photo,
        url: base64Url,
        caption: photo.caption || file.name.replace(/\.[^/.]+$/, ''),
      });
    } catch (err) {
      console.error('Failed replacing image:', err);
    } finally {
      setReplacingId(null);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-20 z-10 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-wide">
            {t.title}
          </h2>
          <p className="text-sm font-sans-luxury text-white/60 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Mode Switcher + Add Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 glass-pill p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setViewMode('polaroid')}
            className={`px-4 py-2 rounded-full text-xs font-sans-luxury tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'polaroid' ? 'bg-purple-600/80 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            {t.polaroidView}
          </button>
          <button
            onClick={() => setViewMode('slideshow')}
            className={`px-4 py-2 rounded-full text-xs font-sans-luxury tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'slideshow' ? 'bg-purple-600/80 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {t.slideshowView}
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-full text-xs font-sans-luxury tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-purple-600/80 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {t.gridView}
          </button>

          {/* Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer transition-colors border border-white/15">
            <Upload className="w-3.5 h-3.5 text-purple-300" />
            <span>{isUploading ? translations[lang].processing : t.uploadPhoto}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
          </label>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/15 my-12">
          <p className="text-white/60 text-sm font-sans-luxury mb-4">{t.noPhotos}</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer transition-colors border border-white/20">
            <Upload className="w-4 h-4" />
            <span>{t.uploadPhoto}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <>
          {/* VIEW 1: POLAROID FLOATING STACK */}
          {viewMode === 'polaroid' && (
            <div className="relative min-h-[500px] flex items-center justify-center py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 50, rotate: photo.rotation || 0 }}
                    animate={{ opacity: 1, y: 0, rotate: photo.rotation || 0 }}
                    whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative bg-zinc-900/90 p-4 rounded-xl border border-white/15 shadow-2xl cursor-pointer transition-all duration-300 animate-float"
                    style={{ animationDelay: `${index * 0.7}s` }}
                  >
                    {/* Image Frame */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-black">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                        <Maximize2 className="w-5 h-5 text-white/90" />
                        <span className="text-[10px] text-purple-200 font-sans-luxury">{t.changePhoto}</span>
                      </div>
                    </div>

                    {/* Polaroid Bottom Label */}
                    <div className="pt-4 pb-1">
                      <p className="font-serif-cormorant italic text-2xl text-purple-200/90 truncate">
                        {photo.caption}
                      </p>
                      <div className="flex items-center justify-between text-xs font-sans-luxury text-white/50 mt-1">
                        {photo.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{photo.date}</span>}
                        {photo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{photo.location}</span>}
                      </div>
                    </div>

                    {/* Direct Action Controls overlay: Replace & Delete */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <label
                        onClick={(e) => e.stopPropagation()}
                        title={t.changePhoto}
                        className="p-1.5 rounded-full bg-black/70 hover:bg-purple-600 text-white/80 hover:text-white transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${replacingId === photo.id ? 'animate-spin' : ''}`} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceUpload(e, photo)}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePhoto(photo.id);
                        }}
                        title={t.deletePhoto}
                        className="p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white/80 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: CINEMATIC SLIDESHOW */}
          {viewMode === 'slideshow' && photos.length > 0 && (
            <div className="relative max-w-4xl mx-auto w-full my-auto py-8">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photos[activeSlideIndex % photos.length].id}
                    src={photos[activeSlideIndex % photos.length].url}
                    alt={photos[activeSlideIndex % photos.length].caption}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Overlay Gradient Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12">
                  <motion.p
                    key={`caption-${activeSlideIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-4xl font-serif-cormorant italic text-white mb-2"
                  >
                    &ldquo;{photos[activeSlideIndex % photos.length].caption}&rdquo;
                  </motion.p>
                  <p className="text-xs font-sans-luxury text-purple-300/80 tracking-widest uppercase">
                    {photos[activeSlideIndex % photos.length].date} • {photos[activeSlideIndex % photos.length].location || (lang === 'en' ? 'Eternal' : 'Abadi')}
                  </p>
                </div>

                {/* Navigation Controls */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-pill hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-pill hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full py-8">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                    <div className="flex justify-end gap-1.5">
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-full bg-black/70 hover:bg-purple-600 text-white transition-all cursor-pointer"
                        title={t.changePhoto}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceUpload(e, photo)}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePhoto(photo.id);
                        }}
                        className="p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-all cursor-pointer"
                        title={t.deletePhoto}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-serif-cormorant text-white truncate">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full glass-card rounded-3xl overflow-hidden border border-white/20 p-6 flex flex-col items-center"
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto object-contain rounded-2xl mb-6 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-2xl font-serif-display text-white text-center">
                {selectedPhoto.caption}
              </h3>
              <p className="text-xs font-sans-luxury text-purple-300/80 mt-2">
                {selectedPhoto.date} {selectedPhoto.location && `• ${selectedPhoto.location}`}
              </p>

              <div className="flex items-center gap-3 mt-6">
                <label className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-2 cursor-pointer border border-white/20">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                  <span>{t.changePhoto}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleReplaceUpload(e, selectedPhoto);
                      setSelectedPhoto(null);
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    onRemovePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="px-4 py-2 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white text-xs flex items-center gap-2 cursor-pointer border border-white/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.deletePhoto}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Scene Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onNext}
          className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-sans-luxury text-sm tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/25 border border-white/20"
        >
          <span>{t.next}</span>
          <ArrowRight className="w-4 h-4 text-purple-200 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
