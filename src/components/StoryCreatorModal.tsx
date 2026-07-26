import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StoryData, PhotoItem } from '../types';
import { compressImageFile, readFileAsDataUrl } from '../utils/storage';
import { translations, Language } from '../data/translations';
import { X, Save, Upload, Download, RotateCcw, Plus, Trash2, Sparkles, Image, Lock, FileText, Video, Music, RefreshCw } from 'lucide-react';

interface StoryCreatorModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  storyData: StoryData;
  onSaveStory: (newStory: StoryData) => void;
  onResetDefault: () => void;
}

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({
  isOpen,
  lang,
  onClose,
  storyData,
  onSaveStory,
  onResetDefault,
}) => {
  const t = translations[lang].studio;
  const [activeTab, setActiveTab] = useState<'general' | 'letter' | 'photos' | 'secret'>('general');
  const [formData, setFormData] = useState<StoryData>(JSON.parse(JSON.stringify(storyData)));
  const [isUploading, setIsUploading] = useState(false);

  // Synchronize formData whenever storyData changes from outer scenes (e.g. GalleryScene direct edits)
  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(storyData)));
    }
  }, [isOpen, storyData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveStory(formData);
    onClose();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bani_story_${formData.recipientName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.title) {
          setFormData(imported);
        }
      } catch (err) {
        alert(lang === 'en' ? 'Invalid BANI JSON story file.' : 'File cerita BANI JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const addPhotoItem = () => {
    const newP: PhotoItem = {
      id: 'p_' + Date.now(),
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      caption: lang === 'en' ? 'New Memory Photo' : 'Momen Kenangan Baru',
      date: lang === 'en' ? 'Recent' : 'Terbaru',
      rotation: (Math.random() - 0.5) * 6,
    };
    const updatedPhotos = [...formData.photos, newP];
    setFormData({ ...formData, photos: updatedPhotos });
    // Live update storyData so changes sync immediately
    onSaveStory({ ...formData, photos: updatedPhotos });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const base64Url = await compressImageFile(file, 1200, 1200, 0.8);
      const updated = [...formData.photos];
      updated[index].url = base64Url;
      if (!updated[index].caption || updated[index].caption === 'Momen Kenangan Baru' || updated[index].caption === 'New Memory Photo') {
        updated[index].caption = file.name.replace(/\.[^/.]+$/, '');
      }
      setFormData({ ...formData, photos: updated });
      onSaveStory({ ...formData, photos: updated });
    } catch (err) {
      console.error('Failed uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhotoItem = (id: string) => {
    const updatedPhotos = formData.photos.filter((p) => p.id !== id);
    setFormData({ ...formData, photos: updatedPhotos });
    onSaveStory({ ...formData, photos: updatedPhotos });
  };

  const handleSecretImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const base64Url = await compressImageFile(file, 1200, 1200, 0.8);
      setFormData({
        ...formData,
        secret: { ...formData.secret, hiddenImageUrl: base64Url },
      });
    } catch (err) {
      console.error('Failed secret image upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSecretVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataUrl(file);
      setFormData({
        ...formData,
        secret: { ...formData.secret, hiddenVideoUrl: dataUrl },
      });
    } catch (err) {
      console.error('Failed secret video upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSecretAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataUrl(file);
      setFormData({
        ...formData,
        secret: { ...formData.secret, hiddenAudioUrl: dataUrl },
      });
    } catch (err) {
      console.error('Failed secret audio upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-3xl w-full glass-card p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-black/90 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs font-sans-luxury text-white/50">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto border-b border-white/10 text-xs font-sans-luxury">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'general' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabs.general}</span>
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'letter' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabs.letter}</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'photos' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>{t.tabs.photos} ({formData.photos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('secret')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'secret' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.tabs.secret}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 text-xs font-sans-luxury pr-2">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">{t.recipient}</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">{t.tagline}</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">{t.introSentence}</label>
                <textarea
                  rows={2}
                  value={formData.introSentence}
                  onChange={(e) => setFormData({ ...formData, introSentence: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">{t.endingMessage}</label>
                <input
                  type="text"
                  value={formData.endingMessage}
                  onChange={(e) => setFormData({ ...formData, endingMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4">
              <label className="block text-white/60 mb-1">{t.letterContent}</label>
              <textarea
                rows={12}
                value={formData.letterContent}
                onChange={(e) => setFormData({ ...formData, letterContent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-amber-100 font-serif-cormorant italic text-2xl focus:outline-none focus:border-purple-400 leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">{t.photoList}</span>
                <button
                  onClick={addPhotoItem}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addPhotoBtn}</span>
                </button>
              </div>

              {formData.photos.map((p, idx) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white"># {idx + 1}</span>
                    <button
                      onClick={() => removePhotoItem(p.id)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{translations[lang].gallery.deletePhoto}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black border border-white/10 flex-shrink-0">
                      <img src={p.url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs inline-flex items-center gap-1.5 cursor-pointer border border-white/15">
                        <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                        <span>{t.uploadPhotoFile}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder={t.pasteUrlPlaceholder}
                        value={p.url}
                        onChange={(e) => {
                          const updated = [...formData.photos];
                          updated[idx].url = e.target.value;
                          setFormData({ ...formData, photos: updated });
                          onSaveStory({ ...formData, photos: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Caption"
                    value={p.caption}
                    onChange={(e) => {
                      const updated = [...formData.photos];
                      updated[idx].caption = e.target.value;
                      setFormData({ ...formData, photos: updated });
                      onSaveStory({ ...formData, photos: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'secret' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pwdProtect"
                  checked={formData.secret.isPasswordProtected}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secret: { ...formData.secret, isPasswordProtected: e.target.checked },
                    })
                  }
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pwdProtect" className="text-white cursor-pointer">
                  {t.lockSecret}
                </label>
              </div>

              {formData.secret.isPasswordProtected && (
                <div>
                  <label className="block text-white/60 mb-1">{t.secretPass}</label>
                  <input
                    type="text"
                    value={formData.secret.password || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secret: { ...formData.secret, password: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/60 mb-1">{t.secretMsg}</label>
                <textarea
                  rows={3}
                  value={formData.secret.hiddenMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secret: { ...formData.secret, hiddenMessage: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">{translations[lang].secret.secretPhoto}</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 cursor-pointer border border-white/15">
                    <Upload className="w-3.5 h-3.5 text-purple-300" />
                    <span>{t.uploadPhotoFile}</span>
                    <input type="file" accept="image/*" onChange={handleSecretImageUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    placeholder={t.pasteUrlPlaceholder}
                    value={formData.secret.hiddenImageUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secret: { ...formData.secret, hiddenImageUrl: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">{translations[lang].secret.secretVideo}</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 cursor-pointer border border-white/15">
                    <Video className="w-3.5 h-3.5 text-purple-300" />
                    <span>{t.uploadVideoFile}</span>
                    <input type="file" accept="video/*" onChange={handleSecretVideoUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    placeholder={t.pasteUrlPlaceholder}
                    value={formData.secret.hiddenVideoUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secret: { ...formData.secret, hiddenVideoUrl: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">{translations[lang].secret.voiceNote}</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 cursor-pointer border border-white/15">
                    <Music className="w-3.5 h-3.5 text-purple-300" />
                    <span>{t.uploadAudioFile}</span>
                    <input type="file" accept="audio/*" onChange={handleSecretAudioUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    placeholder={t.pasteUrlPlaceholder}
                    value={formData.secret.hiddenAudioUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secret: { ...formData.secret, hiddenAudioUrl: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{translations[lang].exportJson}</span>
            </button>
            <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-white/15">
              <Upload className="w-3.5 h-3.5" />
              <span>{translations[lang].importJson}</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
            <button
              onClick={onResetDefault}
              className="px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{translations[lang].reset}</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-sans-luxury text-xs font-medium tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{isUploading ? translations[lang].saving : translations[lang].save}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
