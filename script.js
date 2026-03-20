document.addEventListener('DOMContentLoaded', function() {
    // 1. 轮播逻辑
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;

    // 生成指示器
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

    // 自动轮播
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    startAutoSlide();

    // 悬停暂停
    document.querySelector('.hero-slider').addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    document.querySelector('.hero-slider').addEventListener('mouseleave', startAutoSlide);

    // 2. 移动端菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    mobileMenuBtn?.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // 3. 粒子磁吸跟随效果（核心）
    const canvas = document.getElementById('tech-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = 400;

        // 粒子配置
        const particleCount = 80;
        const particles = [];
        let mouse = { x: width/2, y: height/2, active: false };

        // 粒子类（带磁吸逻辑）
        class MagneticParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 3 + 1;
                this.speed = Math.random() * 0.3 + 0.1;
                this.magneticForce = 0.08;
                this.color = `rgba(230, 0, 18, ${Math.random() * 0.6 + 0.4})`;
            }

            update() {
                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 200) {
                        this.x += dx * this.magneticForce;
                        this.y += dy * this.magneticForce;
                    }
                } else {
                    const dx = this.baseX - this.x;
                    const dy = this.baseY - this.y;
                    this.x += dx * 0.05;
                    this.y += dy * 0.05;
                }
            }

            draw() {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(230, 0, 18, 0)');
                
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            drawLineTo(other) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 80) {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(230, 0, 18, ${0.2 * (1 - distance/80)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // 初始化粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push(new MagneticParticle());
        }

        // 监听鼠标事件
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        // 动画循环
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    particles[i].drawLineTo(particles[j]);
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // 窗口适配
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = 400;
            particles.forEach(particle => {
                particle.baseX = Math.random() * width;
                particle.baseY = Math.random() * height;
            });
        });
    }

    // 4. 联系我们表单提交（备用）
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('提交成功！我们会在1个工作日内与您联系。');
            contactForm.reset();
        });
    }
});