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
  if (slideIndex === 2) {
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
let audioContext = null;
let musicPlaying = false;
let syntheticMusicInterval = null;
const audioEl = document.getElementById("bgMusic");
const musicControl = document.getElementById("musicControl");

// Initialize Music Control Widget Click
musicControl.addEventListener("click", toggleMusic);

function toggleMusic() {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  musicPlaying = true;
  musicControl.classList.add("playing");

  // Warm up SFX AudioContext on user interaction
  SFX.init();

  // Try normal MP3 audio element first
  audioEl.play().then(() => {
    // Successfully playing MP3
    musicControl.querySelector("i").setAttribute("data-lucide", "volume-2");
    lucide.createIcons();
  }).catch((err) => {
    // If MP3 is missing, blocked, or has issues, fallback to Synth melody!
    console.log("Audio file play blocked or failed. Activating procedural synthesizer...", err);
    startSyntheticPiano();
  });
}

function pauseMusic() {
  musicPlaying = false;
  musicControl.classList.remove("playing");
  audioEl.pause();
  stopSyntheticPiano();

  musicControl.querySelector("i").setAttribute("data-lucide", "volume-x");
  lucide.createIcons();
}

// Procedural Synthesizer: Creates beautiful soft piano-like chords and ambient melodies
function startSyntheticPiano() {
  if (syntheticMusicInterval) return; // Already running

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  musicControl.querySelector("i").setAttribute("data-lucide", "music");
  lucide.createIcons();

  // Simple melody notes: Cmaj9 chord notes, Am, F, G (Lullaby-like ambient feel)
  const chordNotes = [
    [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
    [110.00, 130.81, 164.81, 220.00], // Am (A2, C3, E3, A3)
    [87.31, 130.81, 174.61, 220.00],  // F (F2, C3, F3, A3)
    [98.00, 146.83, 196.00, 246.94]   // G (G2, D3, G3, B3)
  ];

  const melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25 // C4, D4, E4, G4, A4, C5 (Pentatonic Scale)
  ];

  let beat = 0;

  function playSynthBeat() {
    if (!musicPlaying) return;

    const time = audioContext.currentTime;

    // Play Chords (every 4 beats)
    if (beat % 4 === 0) {
      const chordIndex = Math.floor(beat / 4) % chordNotes.length;
      const currentChord = chordNotes[chordIndex];

      currentChord.forEach((freq) => {
        // Soft synth voice (sine + lowpass filter)
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, time); // warm low tones

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.8); // Long release

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
      gain.gain.linearRampToValueAtTime(0.06, time + 0.05); // quick attack
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8); // decay

      // Delay effect for spacey vibe
      delay.delayTime.value = 0.35;
      feedback.gain.value = 0.4;

      osc.connect(gain);
      gain.connect(audioContext.destination);

      // Feed delay loop
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(audioContext.destination);

      osc.start(time);
      osc.stop(time + 2);
    }

    beat++;
  }

  // Set ticking interval (beat every 1.5 seconds)
  playSynthBeat();
  syntheticMusicInterval = setInterval(playSynthBeat, 1500);
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

let stars = [];
let particles = [];
let mode = "stars"; // 'stars', 'burst', 'fireworks'

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}
window.addEventListener("resize", resizeCanvas);

// Init Starfield
function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      driftX: (Math.random() - 0.5) * 0.1,
      driftY: (Math.random() - 0.5) * 0.05
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

    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

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

  // Wait for flap opening animation, then run high-end GSAP entrance timeline for letter modal
  setTimeout(() => {
    letterOverlay.classList.add("active");
    
    // Clear any previous inline styles to prevent animation conflicts
    gsap.killTweensOf([letterOverlay, letterCard]);
    
    const tl = gsap.timeline({
      onComplete: () => {
        typewriteContent();
      }
    });

    // 1. Smoothly fade in overlay backdrop
    tl.fromTo(letterOverlay, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.45, ease: "power2.out" }
    );

    // 2. Fly letter card from bottom center with 3D perspective tilt & bouncy landing
    tl.fromTo(letterCard,
      { 
        opacity: 0, 
        y: 300, 
        scale: 0.4, 
        rotation: -10, 
        rotationX: 35, 
        transformPerspective: 1200 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotation: 0, 
        rotationX: 0, 
        duration: 0.95, 
        ease: "back.out(1.4)" 
      },
      "-=0.3"
    );
  }, 850);
}

function closeLetterEnvelope() {
  letterOpened = false;
  envelope.classList.remove("opened");
  letterInstruct.textContent = "Click the envelope to open";

  // Reset typewriter
  typewriterText.textContent = "";

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
      // Reset inline variables for next entrance
      gsap.set(letterCard, { y: 0, scale: 1, rotation: 0, opacity: 1 });
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

  // Stop background music 12 seconds after the candle is blown out (within 10-15s window)
  if (musicStopTimeout) clearTimeout(musicStopTimeout);
  musicStopTimeout = setTimeout(() => {
    pauseMusic();
    musicStopTimeout = null;
  }, 12000);

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
  }, 1800 / 30); // emit regularly
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

  // Load SVG Icons
  lucide.createIcons();

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
    });
  });

  // Close gallery zoom modal
  function closeZoomModal() {
    if (!galleryOverlay.classList.contains("active")) return;
    galleryOverlay.classList.remove("active");
    SFX.playWhoosh();
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

      // Restart music when replaying the storybook
      playMusic();

      // Go back to the dedication page (Slide 1)
      navigateToSlide(1);
    });
  }
}

window.addEventListener("DOMContentLoaded", init);
