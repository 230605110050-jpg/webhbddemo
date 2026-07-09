/**
 * Happy Birthday Salsu - Interactive Storybook Logic
 * Built with vanilla JavaScript & GSAP (GreenSock)
 */

// ==========================================================================
// CONFIGURATION & PERSONALIZATION
// ==========================================================================
const CONFIG = {
  recipientName: "Cantika Melati Nugraini",
  birthDate: new Date("2005-04-05T00:00:00"),
  birthMonthIndex: 3, // April is month index 3 (0-indexed)
  birthDay: 5,
  letterText: `Hi Cantika,

Selamat Ulang Tahun yang ke-21! (atau ke-22 jika kita menghitung tahun ini, hehe) ✨

Hari ini adalah hari yang sangat istimewa, bukan hanya untukmu, tapi juga untuk dunia ini yang beruntung memilikimu selama bertahun-tahun. Halaman ini adalah kado kecil dariku untuk merayakan segala hal indah tentang dirimu.

Terima kasih telah menjadi pribadi yang hangat, kuat, dan selalu mencerahkan hari-hari di sekitarmu dengan senyuman dan tawamu. Aku berharap tahun yang baru ini membawakanmu kebahagiaan yang melimpah, kesehatan, dan terwujudnya semua mimpi-mimpimu.

Ingatlah bahwa kamu sangat berharga dan dikagumi oleh banyak orang, terutama aku. Semoga hari ini dan hari-hari selanjutnya dipenuhi dengan momen indah yang membuatmu tersenyum lebar.

Happy Birthday, Cantika.
Have the best day ever! ❤️`
};

// ==========================================================================
// PRE-LOADING FLOWER IMAGES FOR SCREEN EXPLOSION
// ==========================================================================
const flowerImageUrls = [
  "assets/image/pngwing.com.png",
  "assets/image/pngwing.com (1).png",
  "assets/image/pngwing.com (2).png",
  "assets/image/pngwing.com (3).png",
  "assets/image/pngwing.com (4).png",
  "assets/image/pngwing.com (5).png",
  "assets/image/pngwing.com (6).png"
];
const flowerImages = [];
flowerImageUrls.forEach(url => {
  const img = new Image();
  img.src = url;
  flowerImages.push(img);
});

// ==========================================================================
// PAGE / SLIDE STATE MANAGEMENT
// ==========================================================================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const slideDotsContainer = document.getElementById("slideDots");
const storyNav = document.getElementById("storyNav");

// Init slide navigation dots
function initDots() {
  slideDotsContainer.innerHTML = "";
  slides.forEach((_, i) => {
    // Skip landing page in dots? Actually, we can show them for slides > 0
    if (i > 0) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === currentSlide) dot.classList.add("active-dot");
      dot.addEventListener("click", () => {
        if (currentSlide > 0) navigateToSlide(i);
      });
      slideDotsContainer.appendChild(dot);
    }
  });
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    // The dots list is offset by 1 because we don't count the landing page
    if (i + 1 === currentSlide) {
      dot.classList.add("active-dot");
    } else {
      dot.classList.remove("active-dot");
    }
  });
}

function navigateToSlide(targetIndex) {
  if (targetIndex < 0 || targetIndex >= slides.length) return;
  if (targetIndex === 0) return; // Prevent going back to landing page once opened

  // Clear flower patterns interval & music blowout fade if navigating away from the final slide
  if (targetIndex !== slides.length - 1) {
    if (patternInterval) {
      clearInterval(patternInterval);
      patternInterval = null;
    }
    if (musicStopTimeout) {
      clearTimeout(musicStopTimeout);
      musicStopTimeout = null;
    }
    cancelMusicFade();
  }

  // Play whoosh transition SFX
  SFX.playWhoosh();

  const currentEl = slides[currentSlide];
  const targetEl = slides[targetIndex];
  const direction = targetIndex > currentSlide ? 1 : -1;

  // Update navigation button visibility
  if (targetIndex === 1) {
    prevBtn.style.visibility = "hidden"; // Can't go back to landing page
  } else {
    prevBtn.style.visibility = "visible";
  }

  if (targetIndex === slides.length - 1) {
    nextBtn.style.visibility = "hidden"; // Last slide
  } else {
    nextBtn.style.visibility = "visible";
  }

  // Slide Transitions using GSAP with premium blur and scale effects
  // Fade out current slide
  gsap.to(currentEl, {
    autoAlpha: 0,
    y: -40 * direction,
    scale: 0.95,
    filter: "blur(10px)",
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      currentEl.classList.remove("active-slide");

      // Setup target slide starting state
      gsap.set(targetEl, {
        autoAlpha: 0,
        y: 40 * direction,
        scale: 0.95,
        filter: "blur(10px)"
      });

      targetEl.classList.add("active-slide");

      // Fade in target slide
      gsap.to(targetEl, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out"
      });

      // Trigger page specific entry animations
      triggerPageAnimations(targetIndex);
    }
  });

  currentSlide = targetIndex;
  updateDots();
}

// Custom animations based on page activation (utilizing fromTo to reset states reliably)
function triggerPageAnimations(slideIndex) {
  if (slideIndex === 1) {
    // Dedication Page - Animate dedication title and leaves container
    gsap.fromTo(".name-container",
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "back.out(1.2)" }
    );
  } else if (slideIndex === 2) {
    // Milestones Slide - Animate Counter cards
    gsap.fromTo(".counter-card",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "back.out(1.4)", clearProps: "transform" }
    );
    // Animate Calendar wrapper
    gsap.fromTo(".calendar-wrapper",
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "power2.out", clearProps: "transform" }
    );
    // Stagger calendar grid days entry
    gsap.fromTo("#calendarGrid div",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, stagger: 0.015, duration: 0.35, delay: 0.55, ease: "power1.out", clearProps: "transform" }
    );
  } else if (slideIndex === 4) {
    // Things I Like - Stagger cards
    gsap.fromTo(".trait-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power2.out", clearProps: "transform" }
    );
  } else if (slideIndex === 5) {
    // A Year Of - Cards fly in
    gsap.fromTo(".memory-card",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.12, duration: 0.6, ease: "power2.out", clearProps: "transform" }
    );
  } else if (slideIndex === 6) {
    // Polaroid gallery entrance
    gsap.fromTo(".polaroid-frame",
      { opacity: 0, y: 50, rotation: 0 },
      {
        opacity: 1,
        y: 0,
        rotation: (i, target) => parseFloat(target.style.getPropertyValue("--rotation") || 0),
        stagger: 0.15,
        duration: 0.7,
        ease: "back.out(1.2)"
        // Do not clear transform here, because it needs to retain rotation!
      }
    );
  } else if (slideIndex === 7) {
    // Ending Cake animation
    gsap.fromTo("#cake",
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)", clearProps: "transform" }
    );
  }
}

// Navigation event listeners
nextBtn.addEventListener("click", () => navigateToSlide(currentSlide + 1));
prevBtn.addEventListener("click", () => navigateToSlide(currentSlide - 1));

// Keyboard Listeners
document.addEventListener("keydown", (e) => {
  if (currentSlide === 0) return; // Ignore on landing page
  if (e.key === "ArrowRight" || e.key === " ") {
    if (currentSlide < slides.length - 1) navigateToSlide(currentSlide + 1);
  } else if (e.key === "ArrowLeft") {
    if (currentSlide > 1) navigateToSlide(currentSlide - 1);
  }
});

// Mobile Swipe Detectors
let touchstartX = 0;
let touchendX = 0;
document.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});
document.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleSwipe();
});
function handleSwipe() {
  if (currentSlide === 0) return; // No swiping on landing page
  const swipeThreshold = 50;
  if (touchstartX - touchendX > swipeThreshold) {
    // Swipe left (next)
    if (currentSlide < slides.length - 1) navigateToSlide(currentSlide + 1);
  }
  if (touchendX - touchstartX > swipeThreshold) {
    // Swipe right (prev)
    if (currentSlide > 1) navigateToSlide(currentSlide - 1);
  }
}

// ==========================================================================
// BACKGROUND MUSIC WITH PROCEDURAL SYNTHESIZER FALLBACK
// ==========================================================================
// SPOTIFY-STYLE MUSIC WIDGET CONTROLLER
// ==========================================================================
// ==========================================================================
// LANDSCAPE MUSIC WIDGET CONTROLLER (Matches User Screenshot)
// ==========================================================================
// ==========================================================================
// LANDSCAPE MUSIC WIDGET CONTROLLER (Matches User Screenshot)
// ==========================================================================
let audioContext = null;
let musicPlaying = false;
let syntheticMusicInterval = null;
const audioEl = document.getElementById("bgMusic");

// DOM Elements
const musicControl = document.getElementById("musicControl");
const landscapePlayerCard = document.getElementById("landscapePlayerCard");
const closePlayerCard = document.getElementById("closePlayerCard");
const btnPlayPauseCard = document.getElementById("btnPlayPauseCard");
const btnPrevTrack = document.getElementById("btnPrevTrack");
const btnNextTrack = document.getElementById("btnNextTrack");

const timelineProgress = document.getElementById("timelineProgress");
const timelineHandle = document.getElementById("timelineHandle");
const timelineBar = document.getElementById("timelineBar");
const timeCurrent = document.getElementById("timeCurrent");
const timeDuration = document.getElementById("timeDuration");

const volumeProgress = document.getElementById("volumeProgress");
const volumeHandle = document.getElementById("volumeHandle");
const volumeBar = document.getElementById("volumeBar");

// Music Player Playlist
const playlist = [
  {
    title: "Salsu's Special Theme",
    artist: "Happy Birthday Cantika",
    source: "assets/music.mp3",
    isMp3: true,
    color: "linear-gradient(135deg, var(--gold) 0%, #f472b6 100%)"
  },
  {
    title: "Midnight Lullaby",
    artist: "Synthesized Harmony",
    source: "synth-lullaby",
    isMp3: false,
    color: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
  },
  {
    title: "Starlight Waltz",
    artist: "Synthesized Dream",
    source: "synth-waltz",
    isMp3: false,
    color: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
  }
];

let currentTrackIndex = 0;
let globalVolume = 0.8;

// Synth timer variables
let synthSeconds = 0;
let synthTimer = null;
const synthDuration = 134; // 2:14 simulated duration

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Slider Draggable Utility Function
function makeSliderDraggable(barElement, progressElement, handleElement, callback) {
  if (!barElement) return;
  let isDragging = false;

  function updateValue(clientX) {
    const rect = barElement.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    progressElement.style.width = `${pct * 100}%`;
    if (handleElement) {
      handleElement.style.left = `${pct * 100}%`;
    }
    callback(pct);
  }

  barElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateValue(e.clientX);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    updateValue(e.clientX);
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  barElement.addEventListener("touchstart", (e) => {
    isDragging = true;
    updateValue(e.touches[0].clientX);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, { passive: true });

  function onTouchMove(e) {
    if (!isDragging) return;
    updateValue(e.touches[0].clientX);
  }

  function onTouchEnd() {
    isDragging = false;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }
}

// 1. Toggle Player Card on Compact Pill Click
musicControl.addEventListener("click", () => {
  const isActive = landscapePlayerCard.classList.contains("active");
  if (isActive) {
    landscapePlayerCard.classList.remove("active");
    SFX.playWhoosh();
  } else {
    landscapePlayerCard.classList.add("active");
    SFX.playPop();
  }
});

// 2. Close Player Card on card cross click
closePlayerCard.addEventListener("click", (e) => {
  e.stopPropagation();
  landscapePlayerCard.classList.remove("active");
  SFX.playWhoosh();
});

// 3. Play/Pause toggle inside Card
btnPlayPauseCard.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMusic();
});

// 4. Track Change Navigation Buttons
if (btnPrevTrack) {
  btnPrevTrack.addEventListener("click", (e) => {
    e.stopPropagation();
    SFX.playPop();
    loadTrack(currentTrackIndex - 1);
  });
}

if (btnNextTrack) {
  btnNextTrack.addEventListener("click", (e) => {
    e.stopPropagation();
    SFX.playPop();
    loadTrack(currentTrackIndex + 1);
  });
}

// 5. Volume Slider Drag & click Control
makeSliderDraggable(volumeBar, volumeProgress, volumeHandle, (pct) => {
  audioEl.volume = pct;
  globalVolume = pct;
});

// 6. Timeline Slider Drag & click control
makeSliderDraggable(timelineBar, timelineProgress, timelineHandle, (pct) => {
  const track = playlist[currentTrackIndex];
  if (track.isMp3 && audioEl.duration) {
    audioEl.currentTime = pct * audioEl.duration;
  } else {
    synthSeconds = Math.floor(pct * synthDuration);
    timeCurrent.textContent = formatTime(synthSeconds);
  }
});

// 7. Normal MP3 Progress Bar update
audioEl.addEventListener("timeupdate", () => {
  const track = playlist[currentTrackIndex];
  if (musicPlaying && track.isMp3 && audioEl.duration) {
    const cur = audioEl.currentTime;
    const dur = audioEl.duration;
    timeCurrent.textContent = formatTime(cur);
    timeDuration.textContent = formatTime(dur);
    const pct = (cur / dur) * 100;
    timelineProgress.style.width = `${pct}%`;
    timelineHandle.style.left = `${pct}%`;
  }
});

audioEl.addEventListener("loadedmetadata", () => {
  const track = playlist[currentTrackIndex];
  if (track.isMp3 && audioEl.duration) {
    timeDuration.textContent = formatTime(audioEl.duration);
  }
});

function startSynthTimer() {
  if (synthTimer) clearInterval(synthTimer);
  timeDuration.textContent = formatTime(synthDuration);
  synthTimer = setInterval(() => {
    const track = playlist[currentTrackIndex];
    if (musicPlaying && !track.isMp3) {
      synthSeconds++;
      if (synthSeconds > synthDuration) {
        synthSeconds = 0;
      }
      timeCurrent.textContent = formatTime(synthSeconds);
      const pct = (synthSeconds / synthDuration) * 100;
      timelineProgress.style.width = `${pct}%`;
      timelineHandle.style.left = `${pct}%`;
    }
  }, 1000);
}

function stopSynthTimer() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
  synthSeconds = 0;
}

function toggleMusic() {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function loadTrack(index) {
  currentTrackIndex = (index + playlist.length) % playlist.length;
  const track = playlist[currentTrackIndex];

  document.querySelector(".track-title").textContent = track.title;
  document.querySelector(".track-artist").textContent = track.artist;

  const vinylCenter = document.querySelector(".vinyl-center");
  if (vinylCenter) {
    vinylCenter.style.background = track.color;
  }

  audioEl.pause();
  stopSyntheticPiano();
  stopSynthTimer();

  timelineProgress.style.width = "0%";
  timelineHandle.style.left = "0%";
  timeCurrent.textContent = "0:00";

  if (musicPlaying) {
    startTrackPlayback(track);
  }
}

function startTrackPlayback(track) {
  if (track.isMp3) {
    audioEl.play().then(() => {
      btnPlayPauseCard.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="14" y="4" rx="1"/><rect width="4" height="16" x="6" y="4" rx="1"/></svg>`;
      const compactBtn = musicControl.querySelector(".music-btn");
      if (compactBtn) {
        compactBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
      }
      if (audioEl.duration) {
        timeDuration.textContent = formatTime(audioEl.duration);
      }
    }).catch((err) => {
      console.log("MP3 play failed, falling back to synth...", err);
      startSyntheticPiano(track.source);
      startSynthTimer();
      btnPlayPauseCard.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="14" y="4" rx="1"/><rect width="4" height="16" x="6" y="4" rx="1"/></svg>`;
      const compactBtn = musicControl.querySelector(".music-btn");
      if (compactBtn) {
        compactBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
      }
    });
  } else {
    startSyntheticPiano(track.source);
    startSynthTimer();
    btnPlayPauseCard.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="14" y="4" rx="1"/><rect width="4" height="16" x="6" y="4" rx="1"/></svg>`;
    const compactBtn = musicControl.querySelector(".music-btn");
    if (compactBtn) {
      compactBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
    }
  }
}

function playMusic() {
  cancelMusicFade();
  musicPlaying = true;
  musicControl.classList.add("playing");
  landscapePlayerCard.classList.add("playing");

  SFX.init();

  const track = playlist[currentTrackIndex];
  startTrackPlayback(track);
}

function pauseMusic() {
  musicPlaying = false;
  musicControl.classList.remove("playing");
  landscapePlayerCard.classList.remove("playing");
  audioEl.pause();
  stopSyntheticPiano();
  stopSynthTimer();

  btnPlayPauseCard.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
  const compactBtn = musicControl.querySelector(".music-btn");
  if (compactBtn) {
    compactBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`;
  }
}

let fadeInterval = null;
let originalVolumeBeforeFade = null;

function fadeOutAndPauseMusic(durationMs = 5000) {
  if (fadeInterval) clearInterval(fadeInterval);

  const startVolume = audioEl.volume;
  originalVolumeBeforeFade = globalVolume;

  const intervalTime = 100;
  const steps = durationMs / intervalTime;
  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    const fraction = 1 - (currentStep / steps);
    const newVolume = Math.max(0, startVolume * fraction);

    audioEl.volume = newVolume;
    globalVolume = newVolume;

    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      pauseMusic();

      // Restore volume settings for future playback
      audioEl.volume = originalVolumeBeforeFade;
      globalVolume = originalVolumeBeforeFade;
      originalVolumeBeforeFade = null;
    }
  }, intervalTime);
}

function cancelMusicFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  if (originalVolumeBeforeFade !== null) {
    audioEl.volume = originalVolumeBeforeFade;
    globalVolume = originalVolumeBeforeFade;
    originalVolumeBeforeFade = null;
  }
}

// Procedural Synthesizer: Creates beautiful soft piano-like chords and ambient melodies
function startSyntheticPiano(trackType) {
  if (syntheticMusicInterval) return; // Already running

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // Set progressions based on track type
  let chordNotes = [
    [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
    [110.00, 130.81, 164.81, 220.00], // Am (A2, C3, E3, A3)
    [87.31, 130.81, 174.61, 220.00],  // F (F2, C3, F3, A3)
    [98.00, 146.83, 196.00, 246.94]   // G (G2, D3, G3, B3)
  ];

  let melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25 // C4, D4, E4, G4, A4, C5 (Pentatonic Scale)
  ];

  let tempo = 1500; // default beat rate

  if (trackType === "synth-lullaby") {
    chordNotes = [
      [110.00, 146.83, 174.61, 220.00], // Dm (D2, D3, F3, A3)
      [82.41, 130.81, 164.81, 196.00],  // Em (E2, C3, E3, G3)
      [87.31, 130.81, 174.61, 220.00],  // F (F2, C3, F3, A3)
      [110.00, 164.81, 196.00, 246.94]  // Esus4 (A2, E3, G3, B3)
    ];
    melodyNotes = [
      220.00, 246.94, 261.63, 329.63, 392.00, 440.00
    ];
    tempo = 1800; // slower lullaby tempo
  } else if (trackType === "synth-waltz") {
    chordNotes = [
      [130.81, 196.00, 261.63, 329.63], // C major waltz base
      [87.31, 174.61, 261.63, 349.23],  // F major waltz base
      [98.00, 196.00, 293.66, 392.00]   // G major waltz base
    ];
    melodyNotes = [
      261.63, 329.63, 392.00, 523.25
    ];
    tempo = 1000; // waltz waltz waltz
  }

  let beat = 0;

  function playSynthBeat() {
    if (!musicPlaying) return;

    const time = audioContext.currentTime;

    // Scale gains by global volume
    const chordVol = 0.04 * globalVolume;
    const melodyVol = 0.06 * globalVolume;

    // Play Chords (every 4 beats)
    if (beat % 4 === 0) {
      const chordIndex = Math.floor(beat / 4) % chordNotes.length;
      const currentChord = chordNotes[chordIndex];

      currentChord.forEach((freq) => {
        // Soft synth voice (triangle wave + lowpass filter)
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(chordVol, time + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(time);
        osc.stop(time + 4);
      });
    }

    // Play Random Soft Melody Notes (every beat, 60% probability)
    if (Math.random() < 0.6) {
      const noteFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const delay = audioContext.createDelay();
      const feedback = audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(melodyVol, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

      // Spacey delay loop feedback
      delay.delayTime.value = 0.35;
      feedback.gain.value = 0.4;

      osc.connect(gain);
      gain.connect(audioContext.destination);

      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(audioContext.destination);

      osc.start(time);
      osc.stop(time + 2);
    }

    beat++;
  }

  playSynthBeat();
  syntheticMusicInterval = setInterval(playSynthBeat, tempo);
}

function stopSyntheticPiano() {
  if (syntheticMusicInterval) {
    clearInterval(syntheticMusicInterval);
    syntheticMusicInterval = null;
  }
}

// ==========================================================================
// WEB AUDIO API SYNTHESIZED SOUND EFFECTS (SFX) SYSTEM
// ==========================================================================
const SFX = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  playGiftOpen() {
    this.init();
    const time = this.ctx.currentTime;

    // Sparkly chime riser (increased volume to 0.25)
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const freq = 400 + i * 120;
      osc.frequency.setValueAtTime(freq, time + i * 0.08);

      gain.gain.setValueAtTime(0, time + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, time + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time + i * 0.08);
      osc.stop(time + i * 0.08 + 0.5);
    }

    // Whoosh filter noise
    this.playWhoosh(0.5);
  },

  playWhoosh(duration = 0.35) {
    this.init();
    const time = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, time);
    filter.frequency.exponentialRampToValueAtTime(10, time + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, time); // increased from 0.06 to 0.18
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + duration);
  },

  playPop() {
    this.init();
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, time);
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.15);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.01); // increased from 0.12 to 0.35
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
  },

  playPaperRustle() {
    this.init();
    const time = this.ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3000 + Math.random() * 1500, time + i * 0.06);
      filter.Q.value = 4;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, time + i * 0.06 + 0.01); // increased from 0.04 to 0.2
      gain.gain.exponentialRampToValueAtTime(0.0001, time + i * 0.06 + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(time + i * 0.06);
      noise.stop(time + i * 0.06 + 0.08);
    }
  },

  playBlow() {
    this.init();
    const time = this.ctx.currentTime;
    const duration = 0.45;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, time);
    filter.frequency.exponentialRampToValueAtTime(10, time + duration - 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + duration);
  },

  playFireworks() {
    this.init();
    const time = this.ctx.currentTime;

    for (let i = 0; i < 16; i++) {
      const delay = Math.random() * 2.2;
      const popTime = time + delay;

      if (i % 3 === 0) {
        const boom = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        boom.type = "sine";
        boom.frequency.setValueAtTime(90 + Math.random() * 40, popTime);
        boom.frequency.exponentialRampToValueAtTime(10, popTime + 0.6);

        boomGain.gain.setValueAtTime(0.2, popTime);
        boomGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.6);

        boom.connect(boomGain);
        boomGain.connect(this.ctx.destination);
        boom.start(popTime);
        boom.stop(popTime + 0.6);
      }

      const bufferSize = this.ctx.sampleRate * (0.04 + Math.random() * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }

      const snap = this.ctx.createBufferSource();
      snap.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000 + Math.random() * 3000, popTime);

      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(0.08, popTime);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.08);

      snap.connect(filter);
      filter.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snap.start(popTime);
      snap.stop(popTime + 0.1);
    }
  },

  playTypewriterTick() {
    this.init();
    const time = this.ctx.currentTime;

    // Soft iOS-style wooden touch keyboard tick (soft hollow clack)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    // Soft low-mid woodblock frequency click: 240Hz to 80Hz
    osc.frequency.setValueAtTime(240 + Math.random() * 50, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.025);

    // Smooth gain decay
    const vol = 0.16 + Math.random() * 0.06; // clear but gentle volume
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.028);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }
};

// ==========================================================================
// BACKGROUND & SURPRISE EFFECTS (HTML5 CANVAS)
// ==========================================================================
const canvas = document.getElementById("globalCanvas");
const ctx = canvas.getContext("2d");

// Local canvas variables for gallery modal flower burst
const galleryCanvas = document.getElementById("galleryCanvas");
let galleryCtx = null;
let galleryParticles = [];

let stars = [];
let particles = [];
let shootingStars = [];
let mode = "stars"; // 'stars', 'burst', 'fireworks'

// Constellation class for faint connected stars in background
class Constellation {
  constructor(cx, cy, numStars = 6) {
    this.cx = cx;
    this.cy = cy;
    this.stars = [];
    this.edges = [];
    this.alpha = 0;
    this.state = "fadeIn"; // "fadeIn", "static", "fadeOut"
    this.timer = 0;
    this.staticDuration = 5000 + Math.random() * 4000; // 5-9 seconds static
    this.fadeSpeed = 0.00005 + Math.random() * 0.00004; // speed per ms (slow celestial fade)
    this.maxAlpha = 0.15 + Math.random() * 0.12; // faint gold glowing lines

    // Generate stars relative to center
    const radius = 60 + Math.random() * 70;
    for (let i = 0; i < numStars; i++) {
      const angle = (i / numStars) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const r = radius * (0.4 + Math.random() * 0.6);
      this.stars.push({
        rx: Math.cos(angle) * r,
        ry: Math.sin(angle) * r,
        size: Math.random() * 1.5 + 0.8,
        sparkle: Math.random() < 0.45
      });
    }

    // Connect stars to form network
    for (let i = 0; i < numStars; i++) {
      if (Math.random() < 0.85) {
        this.edges.push([i, (i + 1) % numStars]);
      }
      if (Math.random() < 0.3) {
        const nextNext = (i + 2) % numStars;
        this.edges.push([i, nextNext]);
      }
    }
  }

  update(dt) {
    if (this.state === "fadeIn") {
      this.alpha += this.fadeSpeed * dt;
      if (this.alpha >= this.maxAlpha) {
        this.alpha = this.maxAlpha;
        this.state = "static";
        this.timer = 0;
      }
    } else if (this.state === "static") {
      this.timer += dt;
      if (this.timer >= this.staticDuration) {
        this.state = "fadeOut";
      }
    } else if (this.state === "fadeOut") {
      this.alpha -= this.fadeSpeed * dt;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.state = "dead";
      }
    }
  }

  draw(cCtx) {
    cCtx.save();

    // Draw connected lines (faint glow)
    cCtx.strokeStyle = `rgba(229, 193, 88, ${this.alpha * 0.7})`;
    cCtx.lineWidth = 0.65;
    cCtx.shadowBlur = 3;
    cCtx.shadowColor = "rgba(229, 193, 88, 0.35)";

    this.edges.forEach(([idx1, idx2]) => {
      const p1 = this.stars[idx1];
      const p2 = this.stars[idx2];
      cCtx.beginPath();
      cCtx.moveTo(this.cx + p1.rx, this.cy + p1.ry);
      cCtx.lineTo(this.cx + p2.rx, this.cy + p2.ry);
      cCtx.stroke();
    });

    // Draw star nodes
    cCtx.shadowBlur = 4;
    cCtx.shadowColor = "rgba(255, 255, 255, 0.7)";
    this.stars.forEach(star => {
      const x = this.cx + star.rx;
      const y = this.cy + star.ry;

      cCtx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 1.5})`;
      cCtx.beginPath();
      cCtx.arc(x, y, star.size, 0, Math.PI * 2);
      cCtx.fill();

      if (star.sparkle) {
        cCtx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        cCtx.lineWidth = 0.5;
        cCtx.beginPath();
        cCtx.moveTo(x - star.size * 3.5, y);
        cCtx.lineTo(x + star.size * 3.5, y);
        cCtx.moveTo(x, y - star.size * 3.5);
        cCtx.lineTo(x, y + star.size * 3.5);
        cCtx.stroke();
      }
    });

    cCtx.restore();
  }
}

let constellations = [];
let lastFrameTime = performance.now();

function spawnNewConstellation() {
  const cx = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
  const cy = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
  const numStars = Math.floor(Math.random() * 4) + 5; // 5 to 8 stars
  constellations.push(new Constellation(cx, cy, numStars));
}

function initConstellations() {
  constellations = [];
  const maxConstellations = Math.min(3, Math.max(1, Math.floor(canvas.width / 500)));
  for (let i = 0; i < maxConstellations; i++) {
    const cx = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
    const cy = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
    const numStars = Math.floor(Math.random() * 4) + 5;
    const constel = new Constellation(cx, cy, numStars);
    // Stagger initial states
    constel.alpha = Math.random() * constel.maxAlpha;
    constel.state = Math.random() < 0.5 ? "fadeIn" : "static";
    constel.timer = Math.random() * constel.staticDuration;
    constellations.push(constel);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (galleryCanvas) {
    galleryCanvas.width = window.innerWidth;
    galleryCanvas.height = window.innerHeight;
  }
  initStars();
  initConstellations();
}
window.addEventListener("resize", resizeCanvas);

// Init Starfield
function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 7000);

  const starColors = [
    "rgba(255, 255, 255, ",   // Pure white
    "rgba(254, 240, 138, ",   // Soft yellow
    "rgba(244, 114, 182, ",   // Soft pink
    "rgba(192, 132, 252, ",   // Soft purple
    "rgba(56, 189, 248, ",    // Soft blue
    "rgba(167, 243, 208, ",   // Soft green
    "rgba(253, 186, 116, "    // Soft orange
  ];

  for (let i = 0; i < starCount; i++) {
    const rand = Math.random();
    let shape = "circle";
    let baseSize = Math.random() * 1.5 + 0.5;

    if (rand < 0.55) {
      shape = "circle";
      baseSize = Math.random() * 1.5 + 0.5;
    } else if (rand < 0.75) {
      shape = "sparkle4";
      baseSize = Math.random() * 1.8 + 1.0;
    } else if (rand < 0.90) {
      shape = "cross";
      baseSize = Math.random() * 2.0 + 0.8;
    } else {
      shape = "star5";
      baseSize = Math.random() * 1.8 + 1.0;
    }

    const colorIndex = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * (starColors.length - 1)) + 1;
    const color = starColors[colorIndex];

    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: baseSize,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      driftX: (Math.random() - 0.5) * 0.08,
      driftY: (Math.random() - 0.5) * 0.04,
      shape: shape,
      color: color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015
    });
  }
}

// Canvas Loop
function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Starfield
  stars.forEach((star) => {
    star.alpha += star.twinkleSpeed;
    if (star.alpha > 1 || star.alpha < 0.2) {
      star.twinkleSpeed = -star.twinkleSpeed;
    }

    star.x += star.driftX;
    star.y += star.driftY;

    // Boundary wrapping
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    const colorStr = star.color + star.alpha + ")";
    ctx.fillStyle = colorStr;

    if (star.shape === "circle") {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (star.shape === "sparkle4") {
      star.rotation += star.rotationSpeed;
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.rotate(star.rotation);
      ctx.beginPath();
      const r = star.size * 2.2;
      const innerR = r * 0.25;
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -r);
        ctx.lineTo(innerR, -innerR);
        ctx.rotate(Math.PI / 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (star.shape === "star5") {
      star.rotation += star.rotationSpeed;
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.rotate(star.rotation);
      ctx.beginPath();
      const r = star.size * 2.0;
      const innerR = r * 0.382;
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(0, -r);
        ctx.rotate(Math.PI / 5);
        ctx.lineTo(0, -innerR);
        ctx.rotate(Math.PI / 5);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (star.shape === "cross") {
      star.rotation += star.rotationSpeed;
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.rotate(star.rotation);
      ctx.strokeStyle = colorStr;
      ctx.lineWidth = star.size * 0.35;
      ctx.beginPath();
      const r = star.size * 2.4;
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.stroke();
      ctx.restore();
    }
  });

  // 1.2 Draw & Update Constellations (faint connected stars in background)
  const now = performance.now();
  let deltaTime = now - lastFrameTime;
  lastFrameTime = now;
  if (deltaTime > 1000) deltaTime = 16.67;

  for (let i = constellations.length - 1; i >= 0; i--) {
    const c = constellations[i];
    c.update(deltaTime);
    c.draw(ctx);
    if (c.state === "dead") {
      constellations.splice(i, 1);
      spawnNewConstellation();
    }
  }

  // 1.5. Draw & Update Shooting Stars
  if (Math.random() < 0.0035 && shootingStars.length < 3) {
    const starColors = [
      "rgba(255, 255, 255, ",   // Pure white
      "rgba(254, 240, 138, ",   // Soft yellow
      "rgba(244, 114, 182, ",   // Soft pink
      "rgba(192, 132, 252, ",   // Soft purple
      "rgba(56, 189, 248, ",    // Soft blue
      "rgba(253, 186, 116, "    // Soft orange
    ];
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    shootingStars.push({
      x: Math.random() * (canvas.width + 300) - 100,
      y: Math.random() * (canvas.height * 0.35),
      vx: -Math.random() * 8 - 7,
      vy: Math.random() * 6 + 5,
      length: Math.random() * 12 + 8,
      width: Math.random() * 1.5 + 1.0,
      alpha: 1.0,
      decay: Math.random() * 0.015 + 0.012,
      color: color
    });
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= s.decay;

    if (s.alpha <= 0 || s.x < -100 || s.y > canvas.height + 100) {
      shootingStars.splice(i, 1);
      continue;
    }

    const grad = ctx.createLinearGradient(
      s.x,
      s.y,
      s.x - s.vx * s.length,
      s.y - s.vy * s.length
    );
    grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
    grad.addColorStop(0.2, s.color + s.alpha * 0.75 + ")");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * s.length, s.y - s.vy * s.length);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Draw Flower Burst / Fireworks Particles
  if (particles.length > 0) {
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.decay;

      // Gravity / drag logic
      if (p.gravity) p.vy += p.gravity;
      p.vx *= p.drag || 1;
      p.vy *= p.drag || 1;

      // Spin rotation
      if (p.rotation !== undefined) {
        p.rotation += p.rotationSpeed;
      }

      if (p.alpha <= 0) {
        particles.splice(idx, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      if (p.rotation !== undefined) {
        ctx.rotate(p.rotation);
      }

      if (p.type === "png-flower") {
        if (p.img && p.img.complete) {
          ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.color || "#f472b6";
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.type === "cursor-sparkle") {
        ctx.fillStyle = p.color;
        if (p.shape === "heart") {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.bezierCurveTo(s / 2, -s / 2, s, s / 4, 0, s);
          ctx.bezierCurveTo(-s, s / 4, -s / 2, -s / 2, 0, s / 4);
          ctx.fill();
        } else {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.3, -s * 0.3);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.3, s * 0.3);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.3, s * 0.3);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.3, -s * 0.3);
          ctx.closePath();
          ctx.fill();
        }
      } else if (p.type === "flower") {
        // Draw cute little flower shape
        ctx.fillStyle = p.color;
        const petalCount = 5;
        const size = p.size;
        ctx.beginPath();
        for (let i = 0; i < petalCount; i++) {
          ctx.rotate((Math.PI * 2) / petalCount);
          ctx.ellipse(0, -size / 2, size / 3, size / 1.5, 0, 0, Math.PI * 2);
        }
        ctx.fill();

        // Flower center bulb
        ctx.fillStyle = "#fff7ed";
        ctx.beginPath();
        ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "firework") {
        // Glowing circle/star sparks
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "confetti") {
        // Little rectangles
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
      }

      ctx.restore();
    });
  }

  // Draw Gallery Modal Particles
  if (galleryCanvas && galleryCtx && galleryParticles.length > 0) {
    galleryCtx.clearRect(0, 0, galleryCanvas.width, galleryCanvas.height);
    for (let i = galleryParticles.length - 1; i >= 0; i--) {
      const p = galleryParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.decay;

      if (p.gravity) p.vy += p.gravity;
      p.vx *= p.drag || 1;
      p.vy *= p.drag || 1;

      if (p.rotation !== undefined) {
        p.rotation += p.rotationSpeed;
      }

      if (p.alpha <= 0) {
        galleryParticles.splice(i, 1);
        continue;
      }

      galleryCtx.save();
      galleryCtx.globalAlpha = p.alpha;
      galleryCtx.translate(p.x, p.y);
      if (p.rotation !== undefined) {
        galleryCtx.rotate(p.rotation);
      }

      if (p.type === "png-flower") {
        if (p.img && p.img.complete) {
          galleryCtx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        }
      }
      galleryCtx.restore();
    }
  }

  requestAnimationFrame(animateCanvas);
}

// Generate Flower Explosion (Cinematic Transition with user PNG flowers)
function triggerFlowerExplosion(sourceX, sourceY) {
  particles = [];

  // 1. Massive central explosion from the gift box: shoot flowers in all directions with random sizes
  const centralCount = 180;
  for (let i = 0; i < centralCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 16 + 5;
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: sourceX,
      y: sourceY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3, // upward boost
      size: Math.random() * 65 + 20, // random sizes between 20px and 85px
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: Math.random() * -0.0025 - 0.0015, // slower decay so they linger
      drag: 0.96,
      gravity: 0.06 + Math.random() * 0.04 // randomized gravity for staggered falling
    });
  }

  // 2. Full-screen eruptions: spawn flowers rising from the bottom across the entire width of the screen
  const screenCount = 200;
  for (let i = 0; i < screenCount; i++) {
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100, // staggered start heights
      vx: (Math.random() - 0.5) * 8, // wider sideways drift
      vy: -Math.random() * 18 - 10, // high shoot velocity
      size: Math.random() * 70 + 20, // random sizes between 20px and 90px
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: Math.random() * -0.002 - 0.0015,
      drag: 0.97,
      gravity: 0.05 + Math.random() * 0.04
    });
  }

  // 3. Sparkly firework trails & flares (huge amount for a mega-celebration feel)
  const sparkCount = 180;
  const sparkColors = ["#fef08a", "#fde047", "#facc15", "#f472b6", "#ffedd5", "#fff"];
  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 22 + 4;
    particles.push({
      x: sourceX,
      y: sourceY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 6 + 1.5,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
      type: "firework",
      alpha: 1.0,
      decay: Math.random() * -0.015 - 0.01,
      drag: 0.95
    });
  }
}

// Generate Heart Explosion on clicking red heart
function triggerHeartExplosion(sourceX, sourceY) {
  const heartCount = 75;
  const heartColors = ["#ef4444", "#f43f5e", "#ec4899", "#d946ef", "#db2777", "#e11d48", "#ff0844", "#ff4e50"];

  for (let i = 0; i < heartCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 4;
    const size = Math.random() * 22 + 10; // random sizes 10px to 32px

    particles.push({
      x: sourceX,
      y: sourceY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5, // upward vector boost
      size: size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.12,
      type: "cursor-sparkle",
      shape: "heart",
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      alpha: 1.0,
      decay: -0.015 - Math.random() * 0.01,
      drag: 0.96,
      gravity: 0.05 + Math.random() * 0.05
    });
  }
}

// Generate Candle Blowout Fireworks
function triggerCandleFireworks(sourceX, sourceY) {
  const colors = ["#facc15", "#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981"];

  // Emit continuous bursts
  let burstCount = 0;

  function launchBurst() {
    const burstX = sourceX + (Math.random() - 0.5) * 120;
    const burstY = sourceY - Math.random() * 150;
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    // Spark particles
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 1;
      particles.push({
        x: burstX,
        y: burstY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 3,
        color: baseColor,
        type: "firework",
        alpha: 1.0,
        decay: Math.random() * -0.018 - 0.008,
        drag: 0.96,
        gravity: 0.06
      });
    }

    // Confetti falling
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "confetti",
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        alpha: 1.0,
        decay: Math.random() * -0.005 - 0.002
      });
    }

    // Flowers falling along with confetti (various sizes matching flower explosion)
    const flowerCount = Math.floor(Math.random() * 6) + 12; // 12 to 17 flowers per burst
    for (let i = 0; i < flowerCount; i++) {
      if (flowerImages.length === 0) continue;
      const imgIndex = Math.floor(Math.random() * flowerImages.length);
      particles.push({
        x: Math.random() * canvas.width,
        y: -50 - Math.random() * 50, // staggered start heights
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2.5 + 1.2,
        size: Math.random() * 25 + 15, // random sizes between 15px and 40px (perkecil ukuran)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        type: "png-flower",
        img: flowerImages[imgIndex],
        alpha: 1.0,
        decay: Math.random() * -0.0025 - 0.0015, // slower decay to fall completely
        drag: 0.98,
        gravity: 0.02 + Math.random() * 0.03 // drift down gently
      });
    }

    burstCount++;
    if (burstCount < 8) {
      setTimeout(launchBurst, 250);
    }
  }

  launchBurst();
}

// ==========================================================================
// LANDING PAGE INTERACTION (OPENING GIFT)
// ==========================================================================
const btnOpen = document.getElementById("btnOpen");
const giftBox = document.getElementById("giftBox");

btnOpen.addEventListener("click", openGiftPackage);
giftBox.addEventListener("click", openGiftPackage);

function openGiftPackage() {
  if (giftBox.classList.contains("open")) return;

  // 1. Trigger shake on container, then pop
  giftBox.classList.add("shake");

  setTimeout(() => {
    giftBox.classList.remove("shake");
    giftBox.classList.add("open");

    // Trigger floral canvas explosion at the box coordinates
    const boxRect = giftBox.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;
    triggerFlowerExplosion(boxCenterX, boxCenterY);

    // Play gift open SFX
    SFX.playGiftOpen();

    // Fade out the entire landing glass card and all its contents (box, texts, button) immediately
    gsap.to("#slide-landing .slide-content", {
      opacity: 0,
      scale: 0.92,
      y: -30,
      duration: 0.45,
      ease: "power2.out"
    });

    // Play Background music
    playMusic();
    musicControl.style.display = "flex"; // show music controls

    // Wait for cinematic explosion, then enter slide 2 (extended to allow flowers to drift)
    setTimeout(() => {
      initDots();
      storyNav.style.display = "flex"; // show navigational layers
      currentSlide = 0;
      navigateToSlide(1);
    }, 4800);

  }, 400);
}

// ==========================================================================
// SLIDE 3: ON THIS EARTH (TIMELINE COMPUTATION & CALENDAR GRID)
// ==========================================================================
function updateCounters() {
  const diffTime = Math.abs(new Date() - CONFIG.birthDate);

  const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffTime / (1000 * 60 * 60));
  const minutes = Math.floor(diffTime / (1000 * 60));
  const seconds = Math.floor(diffTime / 1000);

  // Animate values ticking elegantly
  document.getElementById("count-years").textContent = String(years).padStart(2, "0");
  document.getElementById("count-months").textContent = String(months).padStart(2, "0");
  document.getElementById("count-days").textContent = String(days).padStart(2, "0");
  document.getElementById("count-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("count-mins").textContent = String(minutes).padStart(2, "0");
  document.getElementById("count-secs").textContent = String(seconds).padStart(2, "0");
}

function buildCalendarGrid() {
  const gridContainer = document.getElementById("calendarGrid");
  gridContainer.innerHTML = "";

  // Set month details dynamically
  const startDay = new Date(CONFIG.birthDate.getFullYear(), CONFIG.birthMonthIndex, 1).getDay();
  const totalDays = new Date(CONFIG.birthDate.getFullYear(), CONFIG.birthMonthIndex + 1, 0).getDate();

  // Update header text dynamically
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const monthName = monthNames[CONFIG.birthMonthIndex];
  const birthYear = CONFIG.birthDate.getFullYear();
  const monthYearEl = document.getElementById("calendar-month-year");
  if (monthYearEl) {
    monthYearEl.textContent = `${monthName} ${birthYear}`;
  }

  // 1. Populate blank days for empty starts
  for (let i = 0; i < startDay; i++) {
    const blank = document.createElement("div");
    gridContainer.appendChild(blank);
  }

  // 2. Populate dates
  for (let d = 1; d <= totalDays; d++) {
    const dateCell = document.createElement("div");
    dateCell.textContent = d;

    // Highlight birth day
    if (d === CONFIG.birthDay) {
      dateCell.classList.add("bday-date");
    }

    gridContainer.appendChild(dateCell);
  }
}

// ==========================================================================
// SLIDE 4: THE LETTERS & ENVELOPE OPENING EFFECT (WITH MODAL OVERLAY)
// ==========================================================================
const envelope = document.getElementById("envelope");
const letterOverlay = document.getElementById("letterOverlay");
const letterCard = document.getElementById("letterCard");
const closeLetter = document.getElementById("closeLetter");
const typewriterText = document.getElementById("typewriterText");
const letterInstruct = document.getElementById("letterInstruct");
let letterOpened = false;

envelope.addEventListener("click", () => {
  if (!letterOpened) {
    openLetterEnvelope();
  }
});

closeLetter.addEventListener("click", closeLetterEnvelope);
letterOverlay.addEventListener("click", (e) => {
  if (e.target === letterOverlay) {
    closeLetterEnvelope();
  }
});

function openLetterEnvelope() {
  letterOpened = true;
  envelope.classList.add("opened");
  letterInstruct.textContent = "Click letter again to close";

  // Play envelope opening SFX
  SFX.playPaperRustle();

  // Emit hearts floating up from envelope
  emitHearts();

  // Show the overlay immediately
  letterOverlay.classList.add("active");

  // Clear any previous inline styles to prevent animation conflicts
  gsap.killTweensOf([letterOverlay, letterCard]);

  // Calculate relative coordinate offsets to slide out from the envelope
  const envRect = envelope.getBoundingClientRect();
  const cardRect = letterCard.getBoundingClientRect();

  const deltaX = (envRect.left + envRect.width / 2) - (cardRect.left + cardRect.width / 2);
  const deltaY = (envRect.top + envRect.height / 2) - (cardRect.top + cardRect.height / 2);

  const tl = gsap.timeline({
    onComplete: () => {
      typewriteContent();
    }
  });

  // 1. Smoothly fade in overlay backdrop
  tl.fromTo(letterOverlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.7, ease: "power2.out" }
  );

  // 2. Fly letter card from inside the envelope to the center immediately
  tl.fromTo(letterCard,
    {
      opacity: 0,
      x: deltaX,
      y: deltaY + 30, // Offset slightly lower to emerge from inside the envelope pocket
      scale: 0.1,
      rotation: -10,
      rotationX: 30,
      transformPerspective: 1200
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      duration: 1.1,
      ease: "power4.out"
    },
    "-=0.7" // Start at the same time as the backdrop fade-in for 0 delay
  );
}

function closeLetterEnvelope() {
  letterOpened = false;
  envelope.classList.remove("opened");
  letterInstruct.textContent = "Click the envelope to open";

  // Reset typewriter
  typewriterText.textContent = "";

  // Hide download button immediately
  const downloadBtn = document.getElementById("btnDownloadLetter");
  if (downloadBtn) {
    downloadBtn.style.display = "none";
    gsap.set(downloadBtn, { opacity: 0, y: 10 });
  }

  // Dynamic slide down and rotate away
  gsap.killTweensOf([letterOverlay, letterCard]);
  gsap.to(letterCard, {
    opacity: 0,
    y: 200,
    scale: 0.75,
    rotation: 6,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      letterOverlay.classList.remove("active");
      // Reset inline variables for next entrance (including x offset)
      gsap.set(letterCard, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    }
  });
}

function typewriteContent() {
  typewriterText.textContent = "";
  let i = 0;
  const speed = 25; // 25ms delay per char
  const scrollArea = document.querySelector(".letter-scroll-area");

  function type() {
    if (i < CONFIG.letterText.length && letterOpened) {
      const char = CONFIG.letterText.charAt(i);
      typewriterText.textContent += char;

      // Play soft keyboard tap sound (skip space and newline)
      if (char !== " " && char !== "\n") {
        SFX.playTypewriterTick();
      }

      // Auto scroll to follow typing progress
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }

      i++;
      setTimeout(type, speed);
    } else if (i >= CONFIG.letterText.length && letterOpened) {
      // Show download button when typing completes
      const downloadBtn = document.getElementById("btnDownloadLetter");
      if (downloadBtn) {
        downloadBtn.style.display = "inline-flex";
        gsap.fromTo(downloadBtn,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  }

  type();
}

function emitHearts() {
  const emitter = document.querySelector(".hearts-emitter");
  emitter.innerHTML = "";

  // Play pop SFX
  SFX.playPop();

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.style.position = "absolute";
    heart.style.color = "#ef4444";
    heart.style.fontSize = `${Math.random() * 16 + 12}px`;
    heart.innerHTML = "❤️";

    const angle = (Math.random() - 0.5) * 1.5;
    const distance = Math.random() * 80 + 40;

    emitter.appendChild(heart);

    gsap.set(heart, { x: 0, y: 0, autoAlpha: 1, scale: 0.5 });

    gsap.to(heart, {
      x: Math.sin(angle) * distance,
      y: -Math.random() * 150 - 50,
      autoAlpha: 0,
      scale: 1.25,
      duration: Math.random() * 1.2 + 0.8,
      ease: "power1.out",
      onComplete: () => heart.remove()
    });
  }
}

// ==========================================================================
// SLIDE 8: ENDING (CANDLE BLOWING INTERACTION)
// ==========================================================================
const candle = document.getElementById("candle");
const flame = document.getElementById("flame");
const cake = document.getElementById("cake");
const endingTitle = document.getElementById("endingTitle");
const endingSub = document.getElementById("endingSub");
const finalMessage = document.getElementById("finalMessage");

let candleBlown = false;
let musicStopTimeout = null;

candle.addEventListener("click", blowCandleOut);
flame.addEventListener("click", blowCandleOut);

function blowCandleOut() {
  if (candleBlown) return;
  candleBlown = true;

  // Stop and fade background music after candle blowout (30 seconds full volume + 5 seconds fade out)
  if (musicStopTimeout) {
    clearTimeout(musicStopTimeout);
    musicStopTimeout = null;
  }
  cancelMusicFade();
  musicStopTimeout = setTimeout(() => {
    fadeOutAndPauseMusic(5000);
    musicStopTimeout = null;
  }, 30000);

  // 1. Play blow sound and fireworks SFX
  SFX.playBlow();
  SFX.playFireworks();

  // 2. Extinguish the flame with GSAP scaling out
  gsap.to(flame, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      flame.style.display = "none";
    }
  });

  // 3. Trigger fireworks from candle coordinates
  const candleRect = candle.getBoundingClientRect();
  const candleCenterX = candleRect.left + candleRect.width / 2;
  const candleCenterY = candleRect.top;
  triggerCandleFireworks(candleCenterX, candleCenterY);

  // 4. Fade out cake and instructions, slide up final message card
  gsap.to([cake, endingTitle, endingSub], {
    opacity: 0,
    y: -30,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.in",
    onComplete: () => {
      cake.style.display = "none";
      endingTitle.style.display = "none";
      endingSub.style.display = "none";

      // Reveal Final Message with stunning 3D flip-up and staggering element build
      finalMessage.style.display = "block";

      const wishTl = gsap.timeline();

      wishTl.fromTo(finalMessage,
        {
          opacity: 0,
          y: 120,
          scale: 0.75,
          rotationX: -45,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.25,
          ease: "back.out(1.4)"
        }
      );

      // Stagger child elements inside finalMessage for a cohesive build
      wishTl.fromTo("#finalMessage .final-heading",
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.65"
      );

      wishTl.fromTo("#finalMessage .final-sub",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.45"
      );

      wishTl.fromTo("#finalMessage .btn-replay",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.3"
      );

      // Emit continuous float particles at the end
      triggerContinuousConfetti();

      // Start flower patterns sequence
      triggerFlowerPatternsSequence();
    }
  });
}

function triggerContinuousConfetti() {
  const colors = ["#facc15", "#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#3b82f6"];

  setInterval(() => {
    if (currentSlide !== slides.length - 1) return; // Only trigger if on final page

    // Spawn 1-2 particles at random times
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1.5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: "confetti",
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      alpha: 1.0,
      decay: Math.random() * -0.003 - 0.001
    });

    // Spawn continuous flowers occasionally
    if (Math.random() < 0.35 && flowerImages.length > 0) {
      const imgIndex = Math.floor(Math.random() * flowerImages.length);
      particles.push({
        x: Math.random() * canvas.width,
        y: -30,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1.5 + 1.0,
        size: Math.random() * 20 + 10, // random sizes between 10px and 30px (perkecil ukuran)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        type: "png-flower",
        img: flowerImages[imgIndex],
        alpha: 1.0,
        decay: Math.random() * -0.002 - 0.001,
        drag: 0.98,
        gravity: 0.02 + Math.random() * 0.02
      });
    }
  }, 1800 / 30); // emit regularly
}

// ==========================================================================
// ARRANGED FLOWER PATTERNS (HEARTS, ROMANTIC WORDS)
// ==========================================================================
let patternInterval = null;

const glyphs = {
  'I': [
    { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 },
    { x: 0, y: -1 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'L': [
    { x: -1, y: -2 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'O': [
    { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 },
    { x: -1.5, y: -1 }, { x: 1.5, y: -1 },
    { x: -1.5, y: 0 }, { x: 1.5, y: 0 },
    { x: -1.5, y: 1 }, { x: 1.5, y: 1 },
    { x: -1, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'V': [
    { x: -2, y: -2 }, { x: 2, y: -2 },
    { x: -1.5, y: -1 }, { x: 1.5, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -0.5, y: 1 }, { x: 0.5, y: 1 },
    { x: 0, y: 2 }
  ],
  'E': [
    { x: -1, y: -2 }, { x: 0, y: -2 }, { x: 1, y: -2 },
    { x: -1, y: -1 },
    { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'Y': [
    { x: -2, y: -2 }, { x: 2, y: -2 },
    { x: -1, y: -1 }, { x: 1, y: -1 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 }
  ],
  'U': [
    { x: -1.5, y: -2 }, { x: 1.5, y: -2 },
    { x: -1.5, y: -1 }, { x: 1.5, y: -1 },
    { x: -1.5, y: 0 }, { x: 1.5, y: 0 },
    { x: -1.5, y: 1 }, { x: 1.5, y: 1 },
    { x: -1, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'A': [
    { x: 0, y: -2 },
    { x: -0.5, y: -1 }, { x: 0.5, y: -1 },
    { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
    { x: -1.5, y: 1 }, { x: 1.5, y: 1 },
    { x: -2, y: 2 }, { x: 2, y: 2 }
  ],
  'C': [
    { x: 0, y: -2 }, { x: 1, y: -2 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 2 }, { x: 1, y: 2 }
  ],
  'N': [
    { x: -1.5, y: -2 }, { x: 1.5, y: -2 },
    { x: -1.5, y: -1 }, { x: -0.5, y: -1 }, { x: 1.5, y: -1 },
    { x: -1.5, y: 0 }, { x: 0.5, y: 0 }, { x: 1.5, y: 0 },
    { x: -1.5, y: 1 }, { x: 1.5, y: 1 },
    { x: -1.5, y: 2 }, { x: 1.5, y: 2 }
  ],
  'K': [
    { x: -1.2, y: -2 }, { x: 1.2, y: -2 },
    { x: -1.2, y: -1 }, { x: 0.2, y: -1 },
    { x: -1.2, y: 0 }, { x: -0.5, y: 0 },
    { x: -1.2, y: 1 }, { x: 0.2, y: 1 },
    { x: -1.2, y: 2 }, { x: 1.2, y: 2 }
  ]
};

function spawnHeartPattern(cx, cy, scale) {
  const isMobile = canvas.width < 600;
  const finalScale = isMobile ? scale * 0.6 : scale;
  const count = isMobile ? 24 : 36;
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: x * finalScale, y: y * finalScale });
  }

  points.forEach(pt => {
    if (flowerImages.length === 0) return;
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: cx + pt.x + (Math.random() - 0.5) * 4,
      y: cy + pt.y + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
      gravity: 0,
      drag: 1.0,
      size: (Math.random() * 12 + 24) * (isMobile ? 0.7 : 1.0),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: -0.002 - Math.random() * 0.0008
    });
  });
}

function spawnIHeartUPattern(cx, cy) {
  const isMobile = canvas.width < 600;
  const spacing = isMobile ? 70 : 130;
  const scale = isMobile ? 13 : 20;

  // 1. Spawn I
  const pointsI = glyphs['I'] || [];
  pointsI.forEach(pt => {
    if (flowerImages.length === 0) return;
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: cx - spacing + pt.x * scale + (Math.random() - 0.5) * 3,
      y: cy + pt.y * scale + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
      gravity: 0,
      drag: 1.0,
      size: (Math.random() * 8 + 18) * (isMobile ? 0.7 : 1.0),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: -0.002 - Math.random() * 0.0008
    });
  });

  // 2. Spawn ❤️
  const heartCount = isMobile ? 16 : 24;
  const heartPoints = [];
  const heartScale = isMobile ? 2.5 : 4.5;
  for (let i = 0; i < heartCount; i++) {
    const t = (i / heartCount) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    heartPoints.push({ x: x * heartScale, y: y * heartScale });
  }
  heartPoints.forEach(pt => {
    if (flowerImages.length === 0) return;
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: cx + pt.x + (Math.random() - 0.5) * 3,
      y: cy + pt.y + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
      gravity: 0,
      drag: 1.0,
      size: (Math.random() * 8 + 18) * (isMobile ? 0.7 : 1.0),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: -0.002 - Math.random() * 0.0008
    });
  });

  // 3. Spawn U
  const pointsU = glyphs['U'] || [];
  pointsU.forEach(pt => {
    if (flowerImages.length === 0) return;
    const imgIndex = Math.floor(Math.random() * flowerImages.length);
    particles.push({
      x: cx + spacing + pt.x * scale + (Math.random() - 0.5) * 3,
      y: cy + pt.y * scale + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
      gravity: 0,
      drag: 1.0,
      size: (Math.random() * 8 + 18) * (isMobile ? 0.7 : 1.0),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: -0.002 - Math.random() * 0.0008
    });
  });
}

function spawnLovePattern(cx, cy) {
  const isMobile = canvas.width < 600;
  const spacing = isMobile ? 60 : 110;
  const scale = isMobile ? 13 : 20;

  const chars = ['L', 'O', 'V', 'E'];
  const offsets = [-1.5, -0.5, 0.5, 1.5];

  chars.forEach((char, index) => {
    const points = glyphs[char] || [];
    const charCx = cx + offsets[index] * spacing;

    points.forEach(pt => {
      if (flowerImages.length === 0) return;
      const imgIndex = Math.floor(Math.random() * flowerImages.length);
      particles.push({
        x: charCx + pt.x * scale + (Math.random() - 0.5) * 3,
        y: cy + pt.y * scale + (Math.random() - 0.5) * 3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
        gravity: 0,
        drag: 1.0,
        size: (Math.random() * 8 + 18) * (isMobile ? 0.7 : 1.0),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        type: "png-flower",
        img: flowerImages[imgIndex],
        alpha: 1.0,
        decay: -0.002 - Math.random() * 0.0008
      });
    });
  });
}

function spawnNamePattern(cx, cy) {
  const firstName = CONFIG.recipientName.split(" ")[0].toUpperCase();
  const isMobile = canvas.width < 600;

  const charCount = firstName.length;
  const spacing = isMobile ? Math.min(35, canvas.width / (charCount + 1)) : 70;
  const scale = isMobile ? 7 : 12; // smaller scale for longer word

  const totalWidth = (charCount - 1) * spacing;
  const startX = cx - totalWidth / 2;

  for (let i = 0; i < charCount; i++) {
    const char = firstName[i];
    const points = glyphs[char] || [];
    const charCx = startX + i * spacing;

    points.forEach(pt => {
      if (flowerImages.length === 0) return;
      const imgIndex = Math.floor(Math.random() * flowerImages.length);
      particles.push({
        x: charCx + pt.x * scale + (Math.random() - 0.5) * 2,
        y: cy + pt.y * scale + (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: 0.15 + Math.random() * 0.1, // float downwards slowly (atas kebawah)
        gravity: 0,
        drag: 1.0,
        size: (Math.random() * 8 + 18) * (isMobile ? 0.6 : 0.9), // slightly smaller flowers to fit
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        type: "png-flower",
        img: flowerImages[imgIndex],
        alpha: 1.0,
        decay: -0.002 - Math.random() * 0.0008
      });
    });
  }
}

function triggerFlowerPatternsSequence() {
  if (patternInterval) clearInterval(patternInterval);

  let step = 0;
  const sequence = [
    { type: "heart", scale: 9.5 },
    { type: "i_heart_u" },
    { type: "name" }, // Spawns the recipient's first name
    { type: "love" },
    { type: "hearts_random" }
  ];

  function runNext() {
    if (currentSlide !== slides.length - 1) {
      clearInterval(patternInterval);
      patternInterval = null;
      return;
    }

    if (step >= sequence.length) {
      clearInterval(patternInterval);
      patternInterval = null;
      return; // Stop cycling (cukup beberapa kali saja)
    }

    const item = sequence[step % sequence.length];
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.22; // positioned high on the screen (above the text box) to ensure visibility

    if (item.type === "heart") {
      spawnHeartPattern(cx, cy, item.scale);
    } else if (item.type === "i_heart_u") {
      spawnIHeartUPattern(cx, cy);
    } else if (item.type === "name") {
      spawnNamePattern(cx, cy);
    } else if (item.type === "love") {
      spawnLovePattern(cx, cy);
    } else if (item.type === "hearts_random") {
      spawnHeartPattern(cx - canvas.width * 0.25, cy - 40, 5);
      setTimeout(() => {
        if (currentSlide === slides.length - 1) {
          spawnHeartPattern(cx + canvas.width * 0.25, cy + 40, 5);
        }
      }, 1000);
      setTimeout(() => {
        if (currentSlide === slides.length - 1) {
          spawnHeartPattern(cx, cy - 80, 6);
        }
      }, 2000);
    }

    step++;
  }

  // Run the first pattern after 3.5 seconds
  setTimeout(() => {
    if (currentSlide === slides.length - 1) {
      runNext();
      patternInterval = setInterval(runNext, 7000); // cycle every 7 seconds
    }
  }, 3500);
}

function isClickableElement(el) {
  let current = el;
  while (current && current !== document.body) {
    const tagName = current.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea', 'audio', 'video'].includes(tagName)) {
      return true;
    }
    if (current.getAttribute('role') === 'button' || current.getAttribute('role') === 'link') {
      return true;
    }
    // Check computed cursor style from CSS
    const style = window.getComputedStyle(current);
    if (style && style.cursor === 'pointer') {
      return true;
    }
    // Specific check for classes we know are clickable
    if (current.classList && (
      current.classList.contains('polaroid-frame') ||
      current.classList.contains('dot') ||
      current.classList.contains('gift-container') ||
      current.classList.contains('envelope') ||
      current.classList.contains('music-btn') ||
      current.classList.contains('music-equalizer') ||
      current.classList.contains('music-control-wrapper') ||
      current.classList.contains('timeline-bar') ||
      current.classList.contains('volume-bar') ||
      current.classList.contains('player-btn') ||
      current.classList.contains('close-card-btn')
    )) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function triggerClickExplosion(x, y) {
  const count = 12;
  const colors = ["#f472b6", "#fb7185", "#f43f5e", "#ec4899", "#c084fc", "#fff7ed"];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.4,
      size: Math.random() * 6 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: "cursor-sparkle",
      shape: Math.random() < 0.55 ? "heart" : "star",
      alpha: 1.0,
      decay: -0.02 - Math.random() * 0.015,
      drag: 0.96,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08
    });
  }
}

// ==========================================================================
// SYSTEM INITIALIZATION & ADVANCED INTERACTIVE HOVERS
// ==========================================================================
function init() {
  const firstName = CONFIG.recipientName.split(" ")[0];

  // Set browser document tab title dynamically
  document.title = `Happy Birthday, ${firstName}! ❤️`;

  // Wire up romantic cursor trail effect (mousemove & touchmove)
  window.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.28) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.4, // drift up slowly
        size: Math.random() * 6 + 6,
        color: ["#f472b6", "#fb7185", "#f43f5e", "#ec4899", "#c084fc", "#fff7ed"][Math.floor(Math.random() * 6)],
        type: "cursor-sparkle",
        shape: Math.random() < 0.45 ? "heart" : "star",
        alpha: 1.0,
        decay: -0.02 - Math.random() * 0.015,
        drag: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0 && Math.random() < 0.3) {
      const touch = e.touches[0];
      particles.push({
        x: touch.clientX,
        y: touch.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.4,
        size: Math.random() * 6 + 6,
        color: ["#f472b6", "#fb7185", "#f43f5e", "#ec4899", "#c084fc", "#fff7ed"][Math.floor(Math.random() * 6)],
        type: "cursor-sparkle",
        shape: Math.random() < 0.45 ? "heart" : "star",
        alpha: 1.0,
        decay: -0.02 - Math.random() * 0.015,
        drag: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
    }
  });

  window.addEventListener("click", (e) => {
    // Only spawn the explosion if click did not land on an interactive/clickable element
    if (!isClickableElement(e.target)) {
      triggerClickExplosion(e.clientX, e.clientY);
    }
  });

  // Parse and set recipient name
  document.querySelectorAll(".final-heading").forEach(el => {
    el.textContent = `Happy Birthday, ${CONFIG.recipientName}!`;
  });

  // Set recipient name in dedication pre-titles
  const dedicationName = document.querySelector(".dedication-name");
  if (dedicationName) dedicationName.textContent = CONFIG.recipientName;

  // Set recipient name dynamically on landing page
  const landingSubtitle = document.querySelector(".landing-subtitle");
  if (landingSubtitle) {
    landingSubtitle.textContent = `Dear ${firstName}, someone has sent you a digital package. Click above to open it.`;
  }

  // Set recipient name dynamically in letter title
  const letterTitle = document.querySelector(".letter-title");
  if (letterTitle) {
    letterTitle.textContent = `Selamat Ulang Tahun, ${firstName}`;
  }

  // Set recipient name dynamically in final sub
  const finalSub = document.querySelector(".final-sub");
  if (finalSub) {
    finalSub.textContent = `Semoga semua mimpi dan harapanmu terwujud di tahun yang baru ini. Selamat Ulang Tahun, ${firstName}! 🎉✨❤️`;
  }

  // Setup counters
  buildCalendarGrid();
  updateCounters();
  setInterval(updateCounters, 1000);

  // Start Canvas loop
  resizeCanvas();
  animateCanvas();

  // Set audio element volume to 80% to match UI slider starting state
  audioEl.volume = 0.8;

  // Load SVG Icons
  lucide.createIcons();

  // Wire up clicking red heart on slide 2 to trigger heart explosions
  const heartIcon = document.querySelector(".heart-icon-glowing");
  if (heartIcon) {
    heartIcon.style.cursor = "pointer";
    heartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      SFX.playPop();
      const rect = heartIcon.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      triggerHeartExplosion(x, y);

      // Cute heart GSAP pulse animation
      gsap.fromTo(heartIcon,
        { scale: 1 },
        { scale: 1.4, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" }
      );
    });
  }

  // Set landing page visible by default
  gsap.set("#slide-landing", { autoAlpha: 1 });

  // Wire up Polaroid Frame hovers via JS to prevent transform conflicts
  document.querySelectorAll(".polaroid-frame").forEach((frame) => {
    const initialRotation = parseFloat(frame.style.getPropertyValue("--rotation") || 0);

    frame.addEventListener("mouseenter", () => {
      gsap.to(frame, {
        scale: 1.08,
        rotation: 0,
        zIndex: 50,
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6)",
        duration: 0.35,
        ease: "power2.out"
      });
    });

    frame.addEventListener("mouseleave", () => {
      gsap.to(frame, {
        scale: 1.0,
        rotation: initialRotation,
        zIndex: 10,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });

  // Wire up Polaroid Frame click-to-zoom logic
  const galleryOverlay = document.getElementById("galleryOverlay");
  const zoomMediaContainer = document.getElementById("zoomMediaContainer");
  const zoomCaption = document.getElementById("zoomCaption");
  const closeGallery = document.getElementById("closeGallery");

  document.querySelectorAll(".polaroid-frame").forEach((frame) => {
    frame.addEventListener("click", () => {
      const img = frame.querySelector("img");
      const video = frame.querySelector("video");
      const captionText = frame.querySelector(".polaroid-caption").innerHTML;

      zoomMediaContainer.innerHTML = "";

      // Check if image is loaded/visible
      if (img && img.style.display !== "none" && img.complete && img.naturalWidth !== 0) {
        const clone = img.cloneNode(true);
        clone.style.display = "block";
        zoomMediaContainer.appendChild(clone);
      }
      // Check if video is loaded/visible
      else if (video && video.style.display !== "none") {
        const clone = video.cloneNode(true);
        clone.style.display = "block";
        clone.muted = true;
        clone.autoplay = true;
        clone.controls = true; // show play, pause, scrubbing bar in zoom mode
        zoomMediaContainer.appendChild(clone);
        clone.play();
      }
      // Fallback: Copy placeholder contents (camera/video icon + text)
      else {
        const placeholder = frame.querySelector(".polaroid-img-placeholder");
        const clone = placeholder.cloneNode(true);
        // remove display none elements
        clone.querySelectorAll("img, video").forEach(el => el.remove());
        zoomMediaContainer.appendChild(clone);
      }

      zoomCaption.innerHTML = captionText;
      galleryOverlay.classList.add("active");
      SFX.playPop();

      // Trigger the flower burst from behind the card after transition completes
      setTimeout(() => {
        const cardRect = zoomMediaContainer.parentElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const topY = cardRect.top;
        triggerGalleryFlowerBurst(centerX, topY);
      },); // 350ms delay aligned with the CSS scale-up transition
    });
  });

  // Close gallery zoom modal
  function closeZoomModal() {
    if (!galleryOverlay.classList.contains("active")) return;
    galleryOverlay.classList.remove("active");
    SFX.playWhoosh();

    // Clear modal particles immediately
    galleryParticles = [];
    if (galleryCtx && galleryCanvas) {
      galleryCtx.clearRect(0, 0, galleryCanvas.width, galleryCanvas.height);
    }

    // Stop any playing video after transition
    setTimeout(() => {
      zoomMediaContainer.innerHTML = "";
    }, 400);
  }

  if (closeGallery) {
    closeGallery.addEventListener("click", closeZoomModal);
  }
  if (galleryOverlay) {
    galleryOverlay.addEventListener("click", (e) => {
      if (e.target === galleryOverlay) {
        closeZoomModal();
      }
    });
  }

  // Wire up Replay Button
  const btnReplay = document.getElementById("btnReplay");
  if (btnReplay) {
    btnReplay.addEventListener("click", () => {
      candleBlown = false;
      flame.style.display = "block";
      gsap.set(flame, { scale: 1, opacity: 1 });

      cake.style.display = "block";
      endingTitle.style.display = "block";
      endingSub.style.display = "block";
      gsap.set([cake, endingTitle, endingSub], { scale: 1, opacity: 1, y: 0 });

      finalMessage.style.display = "none";
      closeLetterEnvelope();

      // Clear music stop timeout if user replays early
      if (musicStopTimeout) {
        clearTimeout(musicStopTimeout);
        musicStopTimeout = null;
      }

      cancelMusicFade();

      // Clear flower patterns interval if user replays
      if (patternInterval) {
        clearInterval(patternInterval);
        patternInterval = null;
      }

      // Restart music when replaying the storybook
      playMusic();

      // Go back to the dedication page (Slide 1)
      navigateToSlide(1);
    });
  }

  // Wire up Download Letter Button
  const btnDownloadLetter = document.getElementById("btnDownloadLetter");
  if (btnDownloadLetter) {
    btnDownloadLetter.addEventListener("click", () => {
      SFX.playPop();
      downloadLetterAsImage();
    });
  }
}

// Function to render and download the letter as a beautifully styled PNG image
function downloadLetterAsImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // High resolution size
  canvas.width = 800;
  canvas.height = 1000;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw beautiful dark background gradient matching the web app theme
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#110f33");
  grad.addColorStop(1, "#060913");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Draw subtle star-field overlay on background for premium feel
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  for (let i = 0; i < 40; i++) {
    const starX = Math.random() * w;
    const starY = Math.random() * h;
    const starSize = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Draw elegant gold border frame
  ctx.strokeStyle = "rgba(229, 193, 88, 0.3)";
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  ctx.strokeStyle = "rgba(229, 193, 88, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 36, w - 72, h - 72);

  // 4. Draw Title
  const firstName = CONFIG.recipientName.split(" ")[0];
  const titleText = `Selamat Ulang Tahun, ${firstName}`;

  ctx.textAlign = "center";
  ctx.fillStyle = "#e5c158"; // Gold color

  ctx.font = "italic bold 38px 'Playfair Display', 'Georgia', serif";
  ctx.fillText(titleText, w / 2, 95);

  // Subtle divider line
  ctx.strokeStyle = "rgba(229, 193, 88, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 120, 125);
  ctx.lineTo(w / 2 + 120, 125);
  ctx.stroke();

  // 5. Draw Letter Body
  ctx.textAlign = "left";
  ctx.fillStyle = "#f3f4f6"; // bright white

  ctx.font = "italic 24px 'Dancing Script', 'Georgia', cursive";

  const startX = 75;
  const startY = 185;
  const maxTextWidth = w - 150;
  const lineHeight = 38;

  drawTextWithLineWrapping(ctx, CONFIG.letterText, startX, startY, maxTextWidth, lineHeight);

  // 6. Draw footer note
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = "14px 'Poppins', 'sans-serif'";
  ctx.fillText("Dikirim dengan cinta dari website ulang tahun interaktif Anda ❤️", w / 2, h - 55);

  // 7. Trigger file download
  const link = document.createElement("a");
  link.download = `Surat_Untuk_${firstName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Canvas text wrapping function
function drawTextWithLineWrapping(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  let currentY = y;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (paragraph === "") {
      currentY += lineHeight * 0.7; // Paragraph gap
      continue;
    }

    const words = paragraph.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
}

// Trigger Gallery Modal Flower Burst from behind the zoom card
function triggerGalleryFlowerBurst(sourceX, sourceY) {
  if (!galleryCanvas) return;
  if (!galleryCtx) {
    galleryCtx = galleryCanvas.getContext("2d");
  }

  // Spawn flowers shooting upwards from behind the card
  const count = 70;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8; // directed upwards in a wide fan
    const speed = Math.random() * 10 + 4; // speed of the shoot
    const imgIndex = Math.floor(Math.random() * flowerImages.length);

    galleryParticles.push({
      x: sourceX + (Math.random() - 0.5) * 60, // spread horizontally slightly across the top of the card
      y: sourceY + 15, // slightly down from the top edge to look like it emerges from behind the card
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1, // upward boost
      size: Math.random() * 25 + 12, // flower size
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      type: "png-flower",
      img: flowerImages[imgIndex],
      alpha: 1.0,
      decay: Math.random() * -0.003 - 0.002, // fades out slowly as it falls
      drag: 0.97,
      gravity: 0.08 + Math.random() * 0.04 // falls down under gravity
    });
  }
}

window.addEventListener("DOMContentLoaded", init);
