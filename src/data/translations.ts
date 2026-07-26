export type Language = 'en' | 'id';

export const translations = {
  en: {
    // Nav & General
    appTitle: 'BANI',
    tagline: 'Beyond Words.',
    langName: 'English',
    langToggle: 'ID',
    theme: 'Theme',
    themesCount: 'Select Atmosphere Theme (11)',
    music: 'Music',
    musicSettings: 'Music & Audio Settings',
    editStory: 'Edit Story',
    close: 'Close',
    save: 'Save Changes',
    reset: 'Reset Default',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    processing: 'Processing...',
    saving: 'Saving File...',

    // Scenes Nav
    scenes: {
      landing: 'Start',
      intro: 'Intro',
      gallery: 'Gallery',
      letter: 'Letter',
      secret: 'Secret Vault',
      ending: 'Ending',
    },

    // Landing Scene
    landing: {
      enterExperience: 'Begin Experience',
      soundNotice: 'Includes Ambient Sound & Music',
    },

    // Intro Scene
    intro: {
      badge: 'Prologue',
      next: 'Explore Visual Gallery',
    },

    // Gallery Scene
    gallery: {
      title: 'Visual Memory Gallery',
      subtitle: 'Timeless moments captured forever • Touch and explore memories',
      polaroidView: 'Polaroid Stack',
      slideshowView: 'Cinematic Slideshow',
      gridView: 'Grid View',
      uploadPhoto: 'Upload Photo',
      changePhoto: 'Change Photo',
      deletePhoto: 'Delete',
      addPhoto: 'Add Photo',
      newMemory: 'New Memory',
      next: 'Read Digital Letter',
      photoDetail: 'Photo Details',
      noPhotos: 'No photos in the gallery. Upload or add one in the editor!',
      pasteUrl: 'Paste Image URL or Upload File',
    },

    // Letter Scene
    letter: {
      badge: 'Digital Typing Space',
      title: 'Digital Letter For',
      typingSpeed: 'Typing Speed:',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      skipText: 'Show Full Letter',
      next: 'Unlock Secret Vault',
    },

    // Secret Scene
    secret: {
      title: 'Secret Vault',
      lockedSub: 'This content is encrypted for your eyes only',
      enterPass: 'Enter password...',
      unlockBtn: 'Unlock Secret',
      previewBtn: 'Open Without Password (Preview)',
      unlockedBadge: 'Secret Vault Unlocked',
      unlockedTitle: 'Eternal Secret Message',
      secretPhoto: 'Secret Photo',
      secretVideo: 'Secret Video Recording',
      voiceNote: 'Secret Voice Note',
      playVoice: 'Play Voice Message',
      pauseVoice: 'Pause Voice Message',
      next: 'Proceed To Ending',
      wrongPass: 'Incorrect password. Try default password "1204"',
    },

    // Ending Scene
    ending: {
      badge: 'Epilogue',
      subtitle: 'Forever and Always',
      replay: 'Replay Experience',
      share: 'Share Experience Link',
      copied: 'Link Copied!',
    },

    // Creator Studio
    studio: {
      title: 'BANI Creation Studio',
      subtitle: 'Customize text, photos, video, audio & secret vault live',
      tabs: {
        general: 'Title & Intro',
        letter: 'Digital Letter',
        photos: 'Gallery Photos',
        secret: 'Secret Vault',
      },
      recipient: 'Recipient Name',
      tagline: 'Main Tagline',
      introSentence: 'Opening Sentence',
      endingMessage: 'Ending Message',
      letterContent: 'Digital Letter Content',
      addPhotoBtn: '+ Add Photo',
      addTimelineBtn: '+ Add Moment',
      lockSecret: 'Lock Secret Vault with Password',
      secretPass: 'Secret Password',
      secretMsg: 'Secret Eternal Message',
      uploadPhotoFile: 'Upload From Device',
      uploadVideoFile: 'Upload Video File',
      uploadAudioFile: 'Upload Voice Note (MP3/WAV)',
      pasteUrlPlaceholder: 'Or Paste URL',
      photoList: 'Memory Photos',
      timelineList: 'Timeline Events',
    },

    // Audio
    audio: {
      bgMusic: 'Background Music',
      volume: 'Volume',
      uploadCustom: 'Upload Your Own MP3 Song',
    },
  },

  id: {
    // Nav & General
    appTitle: 'BANI',
    tagline: 'Melampaui Kata-Kata.',
    langName: 'Bahasa Indonesia',
    langToggle: 'EN',
    theme: 'Tema',
    themesCount: 'Pilih Tema Suasana (11)',
    music: 'Musik',
    musicSettings: 'Pengaturan Musik & Suara',
    editStory: 'Ubah Cerita',
    close: 'Tutup',
    save: 'Simpan Perubahan',
    reset: 'Reset Default',
    exportJson: 'Ekspor JSON',
    importJson: 'Impor JSON',
    processing: 'Memproses...',
    saving: 'Menyimpan File...',

    // Scenes Nav
    scenes: {
      landing: 'Awal',
      intro: 'Pembuka',
      gallery: 'Galeri',
      letter: 'Surat',
      secret: 'Rahasia',
      ending: 'Penutup',
    },

    // Landing Scene
    landing: {
      enterExperience: 'Mulai Pengalaman',
      soundNotice: 'Dilengkapi Musik & Suara Suasana',
    },

    // Intro Scene
    intro: {
      badge: 'Mukadimah',
      next: 'Jelajahi Galeri Visual',
    },

    // Gallery Scene
    gallery: {
      title: 'Galeri Kenangan Visual',
      subtitle: 'Momen abadi yang terpatri • Sentuh dan jelajahi kenangan',
      polaroidView: 'Tumpukan Polaroid',
      slideshowView: 'Bioskop Slaid',
      gridView: 'Tampilan Kotak',
      uploadPhoto: 'Unggah Foto',
      changePhoto: 'Ganti Foto',
      deletePhoto: 'Hapus',
      addPhoto: 'Tambah Foto',
      newMemory: 'Kenangan Baru',
      next: 'Membaca Surat Digital',
      photoDetail: 'Rincian Foto',
      noPhotos: 'Belum ada foto dalam galeri. Unggah atau tambah di studio edit!',
      pasteUrl: 'Tempel URL Gambar atau Unggah File',
    },

    // Letter Scene
    letter: {
      badge: 'Ruang Ketik Digital',
      title: 'Surat Digital Untuk',
      typingSpeed: 'Kecepatan Ketik:',
      slow: 'Lambat',
      normal: 'Normal',
      fast: 'Cepat',
      skipText: 'Tampilkan Seluruh Surat',
      next: 'Buka Bilik Rahasia',
    },

    // Secret Scene
    secret: {
      title: 'Bilik Rahasia',
      lockedSub: 'Konten ini terenkripsi khusus untuk pandanganmu',
      enterPass: 'Masukkan kata sandi...',
      unlockBtn: 'Buka Rahasia',
      previewBtn: 'Buka Tanpa Sandi (Pratinjau)',
      unlockedBadge: 'Bilik Rahasia Terbuka',
      unlockedTitle: 'Pesan Rahasia Abadi',
      secretPhoto: 'Foto Rahasia',
      secretVideo: 'Rekaman Video Rahasia',
      voiceNote: 'Catatan Suara Rahasia',
      playVoice: 'Putar Pesan Suara',
      pauseVoice: 'Jeda Pesan Suara',
      next: 'Melangkah Ke Penutup',
      wrongPass: 'Sandi salah. Coba sandi default "1204"',
    },

    // Ending Scene
    ending: {
      badge: 'Penutup',
      subtitle: 'Selamanya Dan Abadi',
      replay: 'Putar Ulang Pengalaman',
      share: 'Bagikan Tautan Karya',
      copied: 'Tautan Berhasil Disalin!',
    },

    // Creator Studio
    studio: {
      title: 'Studio Karya BANI',
      subtitle: 'Ubah teks, foto, video, lagu, & bilik rahasia langsung terhubung',
      tabs: {
        general: 'Judul & Pembuka',
        letter: 'Surat Digital',
        photos: 'Galeri Foto',
        secret: 'Bilik Rahasia',
      },
      recipient: 'Nama Penerima Karya',
      tagline: 'Slogan Utama (Tagline)',
      introSentence: 'Kalimat Utama Pembuka',
      endingMessage: 'Pesan Penutup',
      letterContent: 'Isi Surat Digital',
      addPhotoBtn: '+ Tambah Foto',
      addTimelineBtn: '+ Tambah Momen',
      lockSecret: 'Kunci Bilik Rahasia Dengan Kata Sandi',
      secretPass: 'Kata Sandi Rahasia',
      secretMsg: 'Pesan Rahasia Abadi',
      uploadPhotoFile: 'Unggah Dari Perangkat',
      uploadVideoFile: 'Unggah File Video',
      uploadAudioFile: 'Unggah Pesan Suara (MP3/WAV)',
      pasteUrlPlaceholder: 'Atau Tempel URL',
      photoList: 'Daftar Foto Kenangan',
      timelineList: 'Peristiwa Lini Masa',
    },

    // Audio
    audio: {
      bgMusic: 'Pilih Musik Latar',
      volume: 'Volume',
      uploadCustom: 'Unggah Lagu Musik MP3 Sendiri',
    },
  },
};
