document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentIndex = 0;

    function showSlide(index) {
        const offset = -index * 100;
        document.querySelector(".carousel").style.transform = `translateX(${offset}%)`;

        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");

        indicators.forEach(indicator => indicator.classList.remove("active"));
        indicators[index].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    });

    indicators.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            currentIndex = idx;
            showSlide(currentIndex);
        });
    });

    // 自动播放（可选）
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 5000);
});
const modal = document.getElementById('char-modal');
const modalTitle = document.getElementById('modal-title');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.getElementById('modal-close');

function openModal(name, videoSrc) {
  modalTitle.textContent = name;
  modalVideo.src = videoSrc;
  modalVideo.load();
  modalVideo.play();
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.style.display = 'none';
  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideo.src = '';
  modal.setAttribute('aria-hidden', 'true');
}

// 点击头像或名字都触发弹窗
document.querySelectorAll('.avatar-box, .char-name').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const name = el.getAttribute('data-name');
    const videoSrc = el.getAttribute('data-video');
    openModal(name, videoSrc);
  });
});

modalClose.addEventListener('click', closeModal);

// 点击遮罩关闭弹窗
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
