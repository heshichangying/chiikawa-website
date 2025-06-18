document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const carouselContainer = document.querySelector(".carousel-container");

    if (slides.length === 0) return; // Prevent errors if no slides

    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
        const offset = -index * 100;
        document.querySelector(".carousel").style.transform = `translateX(${offset}%)`;
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
        indicators.forEach(indicator => indicator.classList.remove("active"));
        indicators[index].classList.add("active");
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 5000);
    }

    nextBtn.addEventListener("click", () => {
        clearInterval(autoPlayInterval);
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
        startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
        clearInterval(autoPlayInterval);
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
        startAutoPlay();
    });

    indicators.forEach((indicator, idx) => {
        indicator.addEventListener("click", () => {
            clearInterval(autoPlayInterval);
            currentIndex = idx;
            showSlide(currentIndex);
            startAutoPlay();
        });
    });

    // Pause Auto-play on Hover
    carouselContainer.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
    carouselContainer.addEventListener("mouseleave", startAutoPlay);

    // Start Auto-play
    startAutoPlay();
});