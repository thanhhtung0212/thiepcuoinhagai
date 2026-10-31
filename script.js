const CONFIG = {
  photos: Array.from({ length: 22 }, (_, index) => `assets/images/${index + 1}.jpg`)
};

if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
window.addEventListener("pageshow", () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));

function launchEnvelopeHearts() {
  const burst = document.querySelector(".heart-burst");
  const offsets = [[-78,-95],[58,-155],[-10,-220]];
  burst.replaceChildren(...offsets.map(([x, y], i) => {
    const heart = document.createElement("span");
    heart.textContent = "\u2665";
    heart.style.setProperty("--heart-x", `${x}px`);
    heart.style.setProperty("--heart-y", `${y}px`);
    heart.style.setProperty("--heart-delay", `${i * 240}ms`);
    return heart;
  }));
  burst.classList.remove("play");
  void burst.offsetWidth;
  burst.classList.add("play");
  window.setTimeout(() => burst.classList.remove("play"), 3200);
}

function startHeartRain() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rain = document.querySelector(".heart-rain");
  if (!rain || rain.classList.contains("is-active")) return;

  const count = window.matchMedia("(max-width: 650px)").matches ? 24 : 40;
  const hearts = Array.from({ length: count }, () => {
    const heart = document.createElement("span");
    const duration = 9 + Math.random() * 5;
    heart.className = "heart-rain__heart";
    const glyph = document.createElement("span");
    glyph.className = "heart-rain__pulse";
    glyph.textContent = "\u2665";
    heart.appendChild(glyph);
    heart.style.setProperty("--heart-left", `${Math.random() * 100}%`);
    heart.style.setProperty("--heart-size", `${18 + Math.random() * 14}px`);
    heart.style.setProperty("--heart-duration", `${duration}s`);
    heart.style.setProperty("--heart-delay", `${-Math.random() * duration}s`);
    heart.style.setProperty("--heart-drift", `${Math.round(Math.random() * 100 - 50)}px`);
    heart.style.setProperty("--heart-opacity", `${0.24 + Math.random() * 0.26}`);
    const pulseDuration = 1.3 + Math.random() * 0.9;
    heart.style.setProperty("--pulse-duration", `${pulseDuration}s`);
    heart.style.setProperty("--pulse-delay", `${-Math.random() * pulseDuration}s`);
    return heart;
  });
  rain.replaceChildren(...hearts);
  rain.classList.add("is-active");
}

function addDriftingLeaves() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const assets = [
    "assets/theme/decor/Calla Lily Wedding Bouquet Clipart Collection 24.png",
    "assets/theme/decor/Calla Lily Wedding Bouquet Clipart Collection 25.png",
    "assets/theme/decor/Calla Lily Wedding Bouquet Clipart Collection 26.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 11.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 13 - Copy.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 13.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 14.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 15.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 17.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 18.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 20.png",
    "assets/theme/decor/Elegant Botanical Wedding Clipart Collection new 4.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (10) - Copy - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (10) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (11) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (12) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (3).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (4) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (4).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (5) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (5).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (6) - Copy - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (6) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (6).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (7) - Copy - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (7) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (7).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (8) - Copy - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (8) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (8).png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (9) - Copy - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy - Copy (9) - Copy.png",
    "assets/theme/decor/generated-image-77907d57e59e - Copy.png",
    "assets/theme/decor/White Calla Lily Clipart Collection - Copy - Copy - Copy - Copy.png",
    "assets/theme/decor/White Calla Lily Clipart Collection - Copy - Copy - Copy.png"
];
  const sections = document.querySelectorAll(".cover, #site>section, #site>footer");
  const count = window.matchMedia("(max-width:650px)").matches ? 4 : 6;
  const petalCount = 3;
  const extraWhiteCount = 3;
  const whiteFlowers = assets.filter(path => /Calla Lily|Bouquet|Copy - Copy \(3\)\.png$/i.test(path));
  const visibility = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("leaves-in-view", entry.isIntersecting));
  }) : null;
  const resize = "ResizeObserver" in window ? new ResizeObserver(entries => {
    entries.forEach(entry => entry.target.style.setProperty("--leaf-travel", `${entry.target.offsetHeight + 96}px`));
  }) : null;
  sections.forEach((section, sectionIndex) => {
    const layer = document.createElement("div");
    layer.className = "botanical-drift";
    layer.setAttribute("aria-hidden", "true");
    const baseCount = count + petalCount;
    const totalCount = baseCount + extraWhiteCount;
    for (let i = 0; i < totalCount; i++) {
      const isExtraWhite = i >= baseCount;
      const isPetal = i >= count;
      const leaf = document.createElement("span");
      leaf.className = isPetal ? "drifting-leaf drifting-petal" : "drifting-leaf";
      const duration = isExtraWhite ? 15 + (sectionIndex + i * 3) % 8 : 17 + (sectionIndex + i * 3) % 11;
      leaf.style.setProperty("--leaf-left", `${isExtraWhite ? [28, 57, 82][i - baseCount] : isPetal ? [17, 48, 77][i - count] : [6, 86, 24, 70, 44, 94][i]}%`);
      leaf.style.setProperty("--leaf-size", `${1.5 * (isPetal ? 18 + (sectionIndex + i) % 7 : 22 + (sectionIndex + i * 5) % 13)}px`);
      leaf.style.setProperty("--leaf-duration", `${duration}s`);
      leaf.style.setProperty("--leaf-delay", `${-duration * (i + 1) / totalCount}s`);
      leaf.style.setProperty("--leaf-drift", `${i % 2 ? -22 : 24}px`);
      leaf.style.setProperty("--leaf-angle", `${i * 45 - 55}deg`);
      const img = document.createElement("img");
      img.src = isExtraWhite
        ? whiteFlowers[(sectionIndex * extraWhiteCount + i - baseCount) % whiteFlowers.length]
        : assets[(sectionIndex * baseCount + i) % assets.length];
      img.alt = "";
      img.decoding = "async";
      leaf.append(img);
      layer.append(leaf);
    }
    section.prepend(layer);
    section.style.setProperty("--leaf-travel", `${section.offsetHeight + 96}px`);
    resize?.observe(section);
    if (visibility) visibility.observe(section);
    else section.classList.add("leaves-in-view");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addDriftingLeaves();
  const weddingMusic = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const syncMusicToggle = () => {
    const isPlaying = !weddingMusic.paused && !weddingMusic.ended;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Tắt nhạc" : "Bật nhạc");
    musicToggle.title = isPlaying ? "Tắt nhạc" : "Bật nhạc";
  };
  musicToggle.addEventListener("click", () => {
    if (weddingMusic.paused) {
      weddingMusic.play().catch((error) => console.warn("Không thể phát nhạc cưới:", error));
    } else {
      weddingMusic.pause();
    }
  });
  weddingMusic.addEventListener("play", syncMusicToggle);
  weddingMusic.addEventListener("pause", syncMusicToggle);
  weddingMusic.addEventListener("ended", syncMusicToggle);
  const stopWeddingMusic = () => {
    weddingMusic.pause();
    weddingMusic.currentTime = 0;
    syncMusicToggle();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stopWeddingMusic();
  });
  window.addEventListener("pagehide", stopWeddingMusic);

  const site = document.getElementById("site");
  const cover = document.getElementById("top");
  const countdown = document.getElementById("weddingCountdown");
  if (countdown) {
    const deadline = Date.parse(countdown.dataset.deadline);
    const units = {
      days: countdown.querySelector("[data-countdown-days]"),
      hours: countdown.querySelector("[data-countdown-hours]"),
      minutes: countdown.querySelector("[data-countdown-minutes]"),
      seconds: countdown.querySelector("[data-countdown-seconds]")
    };
    const status = document.getElementById("countdownStatus");
    let countdownTimer = 0;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      units.days.textContent = String(Math.floor(remaining / 86400));
      units.hours.textContent = String(Math.floor((remaining % 86400) / 3600)).padStart(2, "0");
      units.minutes.textContent = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
      units.seconds.textContent = String(remaining % 60).padStart(2, "0");
      if (remaining === 0) {
        status.hidden = false;
        window.clearInterval(countdownTimer);
      }
    };
    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }
  const revealSiteSections = () => {
    const sections = [...site.querySelectorAll(":scope > section")];
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    sections.forEach((section) => observer.observe(section));
  };
  site.hidden = true;
  cover.classList.remove("is-open", "is-opening", "is-photo-revealing", "is-decoration-revealing");
  const initialUrl = new URL(window.location.href);
  if (initialUrl.searchParams.has("open")) {
    initialUrl.searchParams.delete("open");
    window.history.replaceState(null, "", initialUrl);
  }
  const envelopeButton = document.getElementById("openEnvelope");
  envelopeButton.addEventListener("click", () => {
    const cover = document.getElementById("top");
    if (!site.hidden || cover.classList.contains("is-opening") || envelopeButton.classList.contains("is-tapped")) return;
    weddingMusic.play().catch((error) => console.warn("Không thể phát nhạc cưới:", error));
    envelopeButton.classList.add("is-tapped");
    window.setTimeout(() => {
      envelopeButton.classList.remove("is-tapped");
      cover.classList.add("is-opening");
      window.setTimeout(() => {
        cover.classList.add("is-photo-revealing", "is-decoration-revealing");
        launchEnvelopeHearts();
      }, 350);
      window.setTimeout(() => {
        cover.classList.add("is-open");
        cover.classList.remove("is-opening", "is-photo-revealing", "is-decoration-revealing");
        site.hidden = false;
        revealSiteSections();
        startHeartRain();
      }, 2200);
    }, 480);
  });

  const albumStack = document.getElementById("albumStack");
  const albumThumbs = document.getElementById("albumThumbs");
  const albumViewer = document.querySelector(".album-viewer");
  const albumCount = document.getElementById("albumCount");
  const albumDialog = document.getElementById("albumDialog");
  const albumDialogImage = document.getElementById("albumDialogImage");
  const albumDialogThumbs = document.getElementById("albumDialogThumbs");
  let photoIndex = 0;
  let albumIsVisible = false;
  let albumIsHovered = false;
  let albumAutoPaused = false;
  let albumAutoTimer = 0;
  let albumPauseTimer = 0;
  let touchStart = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateAlbumAutoplay() {
    window.clearInterval(albumAutoTimer);
    albumAutoTimer = 0;
    if (CONFIG.photos.length < 2 || !albumIsVisible || albumIsHovered || albumDialog.open || albumAutoPaused || reducedMotion.matches) return;
    albumAutoTimer = window.setInterval(() => showPhoto(photoIndex + 1), 4000);
  }

  function pauseAlbumAutoplay() {
    albumAutoPaused = true;
    updateAlbumAutoplay();
    window.clearTimeout(albumPauseTimer);
    albumPauseTimer = window.setTimeout(() => {
      albumAutoPaused = false;
      updateAlbumAutoplay();
    }, 6000);
  }

  function showPhoto(index) {
    // Read layout once before updating cards to avoid repeated forced layouts.
    const spacing = albumViewer.clientWidth * .30;
    photoIndex = (index + CONFIG.photos.length) % CONFIG.photos.length;
    albumCount.textContent = `${photoIndex + 1} / ${CONFIG.photos.length}`;
    albumThumbs.querySelectorAll("button").forEach((button, i) => {
      button.classList.toggle("active", i === photoIndex);
      button.setAttribute("aria-pressed", i === photoIndex ? "true" : "false");
    });
    albumDialogThumbs.querySelectorAll("button").forEach((button, i) => {
      button.classList.toggle("active", i === photoIndex);
      button.setAttribute("aria-pressed", i === photoIndex ? "true" : "false");
    });
    albumStack.querySelectorAll(".album-card").forEach((card, i) => {
      let offset = i - photoIndex;
      if (offset > CONFIG.photos.length / 2) offset -= CONFIG.photos.length;
      if (offset < -CONFIG.photos.length / 2) offset += CONFIG.photos.length;
      const distance = Math.abs(offset);
      const slot = Math.max(-3, Math.min(3, offset));
      const depth = Math.abs(slot);
      const scale = distance === 0 ? 1 : Math.max(.8, 1 - depth * .07);
      const wasDistant = Math.abs(Number(card.dataset.albumOffset ?? offset)) > 2;
      card.style.transition = wasDistant && distance > 2 ? "none" : "";
      card.dataset.albumOffset = String(offset);
      card.style.transform = `translate3d(calc(-50% + ${slot * spacing}px), ${distance === 0 ? -8 : depth * 10}px, ${distance === 0 ? 35 : -depth * 110}px) rotateY(${-slot * 24}deg) rotateZ(${slot * 2}deg) scale(${scale})`;
      card.style.opacity = distance > 2 ? "0" : String(1 - distance * .22);
      card.style.pointerEvents = distance > 2 ? "none" : "";
      card.style.zIndex = String(100 - distance);
      // Warm the next cards before they enter the visible stack.
      const image = card.querySelector("img");
      if (distance <= 3 && image.loading !== "eager") {
        image.loading = "eager";
        if (image.decode) image.decode().catch(() => {});
      }
      card.classList.toggle("is-active", offset === 0);
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });
    if (albumDialog.open) {
      albumDialogImage.src = CONFIG.photos[photoIndex];
      albumDialogImage.alt = `Ảnh cưới Thanh Tùng và Minh Ngọc ${photoIndex + 1}`;
    }
  }

  function openAlbumPhoto(index) {
    showPhoto(index);
    albumDialogImage.src = CONFIG.photos[photoIndex];
    albumDialogImage.alt = `Ảnh cưới Thanh Tùng và Minh Ngọc ${photoIndex + 1}`;
    albumDialog.showModal();
    pauseAlbumAutoplay();
  }
  CONFIG.photos.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "album-card";
    card.style.aspectRatio = "2 / 3";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Xem ảnh cưới ${index + 1}`);
    const photo = document.createElement("img");
    photo.src = src;
    photo.alt = `Ảnh cưới Thanh Tùng và Minh Ngọc ${index + 1}`;
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.addEventListener("load", () => {
      const ratio = photo.naturalWidth / photo.naturalHeight;
      if (ratio > 0) card.style.aspectRatio = String(ratio);
    });
    card.appendChild(photo);
    card.addEventListener("click", () => openAlbumPhoto(index));
    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openAlbumPhoto(index);
    });
    albumStack.appendChild(card);
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.setAttribute("aria-label", `Chọn ảnh ${index + 1}`);
    thumb.setAttribute("aria-pressed", "false");
    thumb.addEventListener("click", () => { showPhoto(index); pauseAlbumAutoplay(); });
    albumThumbs.appendChild(thumb);

    const dialogThumb = document.createElement("button");
    dialogThumb.type = "button";
    dialogThumb.className = "album-dialog-thumb";
    dialogThumb.setAttribute("aria-label", `Xem ảnh ${index + 1}`);
    dialogThumb.setAttribute("aria-pressed", "false");
    const dialogThumbImage = document.createElement("img");
    dialogThumbImage.src = src;
    dialogThumbImage.alt = "";
    dialogThumbImage.loading = "lazy";
    dialogThumb.appendChild(dialogThumbImage);
    dialogThumb.addEventListener("click", () => { showPhoto(index); pauseAlbumAutoplay(); });
    albumDialogThumbs.appendChild(dialogThumb);
  });
  showPhoto(0);
  document.getElementById("albumPrev").addEventListener("click", () => { showPhoto(photoIndex - 1); pauseAlbumAutoplay(); });
  document.getElementById("albumNext").addEventListener("click", () => { showPhoto(photoIndex + 1); pauseAlbumAutoplay(); });
  let albumSwipeClickUntil = 0;
  albumViewer.addEventListener("click", event => {
    if (Date.now() < albumSwipeClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  albumViewer.addEventListener("touchstart", event => {
    if (event.touches.length !== 1) { touchStart = null; return; }
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  albumViewer.addEventListener("touchmove", event => {
    if (!touchStart || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - touchStart.x);
    const dy = Math.abs(touch.clientY - touchStart.y);
    if (dx > 12 && dx > dy * 1.2) {
      if (event.cancelable) event.preventDefault();
      albumSwipeClickUntil = Date.now() + 500;
    }
  }, { passive: false });
  albumViewer.addEventListener("touchcancel", () => { touchStart = null; });
  albumViewer.addEventListener("touchend", event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    touchStart = null;
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > deltaY * 1.2) {
      albumSwipeClickUntil = Date.now() + 500;
      showPhoto(photoIndex + (deltaX < 0 ? 1 : -1));
      pauseAlbumAutoplay();
    }
  });
  albumViewer.addEventListener("mouseenter", () => { albumIsHovered = true; updateAlbumAutoplay(); });
  albumViewer.addEventListener("mouseleave", () => { albumIsHovered = false; updateAlbumAutoplay(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", updateAlbumAutoplay);
  else reducedMotion.addListener(updateAlbumAutoplay);
  if ("IntersectionObserver" in window) {
    const albumObserver = new IntersectionObserver(entries => {
      albumIsVisible = entries.some(entry => entry.isIntersecting);
      updateAlbumAutoplay();
    }, { threshold: 0, rootMargin: "300px 0px" });
    albumObserver.observe(albumViewer);
  } else {
    albumIsVisible = true;
    updateAlbumAutoplay();
  }

  document.getElementById("albumDialogClose").addEventListener("click", () => albumDialog.close());
  document.getElementById("albumDialogPrev").addEventListener("click", () => showPhoto(photoIndex - 1));
  document.getElementById("albumDialogNext").addEventListener("click", () => showPhoto(photoIndex + 1));
  albumDialog.addEventListener("click", event => { if (event.target === albumDialog) albumDialog.close(); });
  albumDialog.addEventListener("close", updateAlbumAutoplay);
  albumDialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showPhoto(photoIndex - 1);
    if (event.key === "ArrowRight") showPhoto(photoIndex + 1);
  });

  const rsvpDialog = document.getElementById("rsvpDialog");
  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpStatus = document.getElementById("rsvpStatus");
  const rsvpSubmitButton = rsvpForm.querySelector('button[type="submit"]');
  document.getElementById("openRsvp").addEventListener("click", () => {
    rsvpDialog.showModal();
    // Keep focus in the opening tap so iOS can activate the keyboard.
    rsvpForm.elements.namedItem("name").focus({ preventScroll: true });
  });
  document.getElementById("closeRsvp").addEventListener("click", () => rsvpDialog.close());
  rsvpDialog.addEventListener("click", event => {
    if (event.target !== rsvpDialog) return;
    const bounds = rsvpDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) rsvpDialog.close();
  });
  rsvpForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const attendance = data.attendance.startsWith("Có")
      ? "Có, tôi sẽ tới đó"
      : "Rất tiếc, tôi không thể tham dự";
    const responseFrame = document.createElement("iframe");
    responseFrame.name = `rsvp-response-${Date.now()}`;
    responseFrame.title = "Gửi xác nhận tham dự";
    responseFrame.hidden = true;
    responseFrame.setAttribute("aria-hidden", "true");

    const submissionForm = document.createElement("form");
    submissionForm.method = "POST";
    submissionForm.action = "https://docs.google.com/forms/d/e/1FAIpQLSeLOwl5-elRvvJNoZNJfN0lYnCpibcLrBGTS0AV_LBpoD0gZQ/formResponse";
    submissionForm.target = responseFrame.name;
    submissionForm.hidden = true;
    [
      ["fvv", "1"],
      ["pageHistory", "0"],
      ["entry.559352220", data.name.trim()],
      ["entry.877086558", attendance],
      ["entry.877086558_sentinel", ""],
      ["entry.924523986", data.guests.replace(/\D/g, "")],
      ["entry.1647591272", data.guestSide]
    ].forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      submissionForm.appendChild(input);
    });

    rsvpStatus.textContent = "Đang gửi xác nhận...";
    rsvpSubmitButton.disabled = true;
    let hasSubmitted = false;
    let isComplete = false;
    const timeout = window.setTimeout(() => {
      if (isComplete) return;
      isComplete = true;
      rsvpStatus.textContent = "Chưa nhận được phản hồi từ Google Forms. Vui lòng kiểm tra kết nối và thử lại.";
      rsvpSubmitButton.disabled = false;
      submissionForm.remove();
      responseFrame.remove();
    }, 20000);

    responseFrame.addEventListener("load", () => {
      if (!hasSubmitted) {
        hasSubmitted = true;
        try {
          submissionForm.submit();
        } catch (error) {
          window.clearTimeout(timeout);
          isComplete = true;
          rsvpStatus.textContent = `Không thể gửi xác nhận: ${error.message}`;
          rsvpSubmitButton.disabled = false;
          submissionForm.remove();
          responseFrame.remove();
        }
        return;
      }
      if (isComplete) return;
      isComplete = true;
      window.clearTimeout(timeout);
      rsvpStatus.textContent = "Cám ơn bạn đã là 1 phần quan trọng trong ngày trọng đại của chúng tôi ♥";
      rsvpSubmitButton.disabled = false;
      submissionForm.remove();
      responseFrame.remove();
    });
    document.body.append(responseFrame, submissionForm);
  });
  const wishForm = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");
  const wishStatus = document.getElementById("wishStatus");
  const wishSubmitButton = wishForm.querySelector(".wish-submit");
  const wishField = wishForm.elements.namedItem("wish");
  const wishSuggestionButton = wishForm.querySelector(".magic-button");
  const wishSuggestionList = document.getElementById("wishSuggestions");
  const guestbookDecor = wishForm.closest(".guestbook-section")
    .querySelectorAll(":scope>.guestbook-art, :scope>.content-accent");
  const guestbookSection = wishForm.closest(".guestbook-section");
  const guestbookPaper = guestbookSection.querySelector(".guestbook-paper");
  const guestbookFlower = guestbookSection.querySelector(".guestbook-flower");
  const alignGuestbookFlower = () => {
    if (!guestbookPaper.offsetWidth || !guestbookFlower.offsetHeight) return;
    // The gold bottom border is at 91.5% of the paper asset;
    // the end of the stem is at 90% of the bouquet asset.
    const borderY = guestbookPaper.offsetTop + guestbookPaper.offsetHeight * .915;
    guestbookFlower.style.top = `${borderY - guestbookFlower.offsetHeight * .9}px`;
    guestbookFlower.style.bottom = "auto";
  };
  guestbookPaper.addEventListener("load", alignGuestbookFlower);
  guestbookFlower.addEventListener("load", alignGuestbookFlower);
  if ("ResizeObserver" in window) {
    const frameAlignment = new ResizeObserver(alignGuestbookFlower);
    [guestbookSection, guestbookPaper, guestbookFlower].forEach(element => frameAlignment.observe(element));
  } else {
    window.addEventListener("resize", alignGuestbookFlower);
  }
  alignGuestbookFlower();
  let decorPositions = [];
  const setWishSuggestionsOpen = isOpening => {
    if (isOpening === !wishSuggestionList.hidden) return;
    if (isOpening) {
      decorPositions = Array.from(guestbookDecor, element => ({
        element, offsetTop: element.offsetTop,
        top: element.style.top, bottom: element.style.bottom
      }));
      decorPositions.forEach(({ element, offsetTop }) => {
        element.style.top = `${offsetTop}px`;
        element.style.bottom = "auto";
      });
    }
    wishSuggestionList.hidden = !isOpening;
    wishSuggestionButton.setAttribute("aria-expanded", String(isOpening));
    if (!isOpening) {
      decorPositions.forEach(({ element, top, bottom }) => {
        element.style.top = top;
        element.style.bottom = bottom;
      });
      decorPositions = [];
    }
  };
  window.addEventListener("resize", () => {
    if (wishSuggestionList.hidden) return;
    setWishSuggestionsOpen(false);
    setWishSuggestionsOpen(true);
  });
  const wishSuggestions = [
    "Chúc Thanh Tùng và Minh Ngọc trăm năm hạnh phúc, luôn yêu thương và đồng hành bên nhau!",
    "Mừng ngày vui của hai bạn! Chúc cuộc sống chung luôn ngập tràn tiếng cười và niềm vui.",
    "Chúc gia đình nhỏ của hai bạn luôn bình an, ấm áp và đầy ắp yêu thương.",
    "Chúc cô dâu chú rể mãi giữ nụ cười rạng rỡ và sự dịu dàng dành cho nhau như hôm nay.",
    "Chúc hai bạn xây dựng tổ ấm viên mãn, cùng nhau đi qua thật nhiều chặng đường đẹp.",
    "Chúc ngày trọng đại thật trọn vẹn và những tháng năm sau này luôn ngọt ngào, hạnh phúc.",
    "Mong hai bạn luôn thấu hiểu, sẻ chia và nắm tay nhau bền lâu qua mọi mùa trong cuộc sống.",
    "Chúc tình yêu của Thanh Tùng và Minh Ngọc ngày càng đong đầy, tổ ấm luôn rộn tiếng cười.",
    "Chúc hai bạn có một khởi đầu thật đẹp và một hành trình hôn nhân bình yên, hạnh phúc.",
    "Chúc mừng Thanh Tùng và Minh Ngọc! Mong mỗi ngày bên nhau đều là một ngày đáng nhớ."
  ];
  wishSuggestions.forEach(suggestion => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wish-suggestion";
    button.textContent = suggestion;
    button.addEventListener("click", () => {
      wishField.value = suggestion;
      setWishSuggestionsOpen(false);
      wishField.focus();
    });
    wishSuggestionList.appendChild(button);
  });
  wishSuggestionButton.addEventListener("click", () => {
    setWishSuggestionsOpen(wishSuggestionList.hidden);
  });
  wishSuggestionButton.addEventListener("keydown", event => {
    if (event.key === "Escape" && !wishSuggestionList.hidden) {
      setWishSuggestionsOpen(false);
    }
  });
  const wishStorageKey = "wedding-wishes-v1";
  const renderWish = data => {
    const card = document.createElement("article"); card.className = "wish-item";
    const name = document.createElement("strong"); name.textContent = data.name;
    const message = document.createElement("p"); message.textContent = data.wish;
    card.append(name, message); wishList.prepend(card);
  };
  const readLocalWishes = () => {
    try { return JSON.parse(localStorage.getItem(wishStorageKey) || "[]"); }
    catch { return []; }
  };
  const saveLocalWish = data => {
    const messages = readLocalWishes();
    messages.unshift(data);
    localStorage.setItem(wishStorageKey, JSON.stringify(messages.slice(0, 500)));
  };
  const wishesApiAvailable = ["http:", "https:"].includes(window.location.protocol);
  (async () => {
    if (wishesApiAvailable) {
      try {
        const response = await fetch("wishes/api.php", { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Wishes API unavailable");
        const result = await response.json();
        (result.messages || []).slice().reverse().forEach(renderWish);
        return;
      } catch { /* Use this browser's saved entries if PHP is unavailable. */ }
    }
    readLocalWishes().slice().reverse().forEach(renderWish);
  })();
  let isSubmittingWish = false;
  const sendWish = async event => {
    event.preventDefault();
    if (isSubmittingWish || !wishForm.reportValidity()) return;
    isSubmittingWish = true;
    wishSubmitButton.disabled = true;
    const data = Object.fromEntries(new FormData(wishForm).entries());
    const messageData = { name: data.name.trim(), wish: data.wish.trim() };
    wishStatus.textContent = "Đang gửi lời chúc…";
    let saved = false;
    try {
      if (!wishesApiAvailable) throw new Error("PHP server is not running");
      const response = await fetch("wishes/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(messageData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể lưu lời chúc.");
      renderWish(result.message);
      wishStatus.textContent = "Cám ơn bạn đã gửi những lời yêu thương cho chúng mình ♥";
      saved = true;
    } catch (error) {
      try {
        saveLocalWish(messageData);
        renderWish(messageData);
        wishStatus.textContent = "Lời chúc đã lưu trên thiết bị này. Để mọi khách cùng xem, cần chạy website trên hosting hỗ trợ PHP.";
        saved = true;
      } catch {
        wishStatus.textContent = error.message || "Không thể lưu lời chúc.";
      }
    }
    if (saved) wishForm.reset();
    isSubmittingWish = false;
    wishSubmitButton.disabled = false;
  };
  wishSubmitButton.addEventListener("click", event => { void sendWish(event); });
  wishForm.addEventListener("submit", event => { void sendWish(event); });
  const giftDialog = document.getElementById("giftDialog");
  const giftTeaser = document.querySelector(".gift-teaser");
  document.getElementById("openGift").addEventListener("click", () => { giftTeaser.classList.add("is-opening"); window.setTimeout(() => { if (!giftDialog.open) giftDialog.showModal(); }, 420); });
  document.getElementById("closeGift").addEventListener("click", () => giftDialog.close());
  giftDialog.addEventListener("close", () => giftTeaser.classList.remove("is-opening"));
  giftDialog.addEventListener("click", event => { if (event.target === giftDialog) giftDialog.close(); });
});
