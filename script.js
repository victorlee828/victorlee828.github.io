document.addEventListener('DOMContentLoaded', function() {
    // 轮播
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    startAutoSlide();

    document.querySelector('.hero-slider').addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    document.querySelector('.hero-slider').addEventListener('mouseleave', startAutoSlide);

    // 移动端菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    mobileMenuBtn?.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // ====================== 粒子磁吸效果（正常跟随鼠标）======================
    const canvas = document.getElementById('tech-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = 400;

    let mouse = {
        x: w / 2,
        y: h / 2,
        isMove: false
    };

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.radius = Math.random() * 2 + 1;
            this.color = 'rgba(255,255,255,0.6)';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function createLines() {
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            const dx = p1.x - mouse.x;
            const dy = p1.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${0.3 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx2 = p1.x - p2.x;
                const dy2 = p1.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,0.2)`;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => p.draw());
        createLines();
        requestAnimationFrame(animate);
    }
    animate();

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = 400;
    });
});