/**
 * 深圳市迪曼微电子科技有限公司官网 - 共享JavaScript功能
 * 包含导航菜单切换、语言切换、表单验证等通用功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            // 切换菜单图标
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 语言切换功能
    const languageButtons = document.querySelectorAll('.language-switcher button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            languageButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            // 这里可以添加实际的语言切换逻辑
            const lang = this.getAttribute('data-lang');
            console.log('切换到语言:', lang);
            // 在实际应用中，这里会加载对应的语言文件或重新加载页面
        });
    });
    
    // 设置当前页面导航项为活动状态
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref !== 'index.html' && currentPage.includes(linkHref.replace('.html', '')))) {
            link.classList.add('active');
        }
    });
    
    // 表单验证（用于联系页面）
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 简单的表单验证
            const name = document.getElementById('name').value.trim();
            const company = document.getElementById('company').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // 清除之前的错误提示
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
            
            // 验证姓名
            if (!name) {
                showError('name', '请输入姓名');
                isValid = false;
            }
            
            // 验证公司
            if (!company) {
                showError('company', '请输入公司名称');
                isValid = false;
            }
            
            // 验证电话
            if (!phone) {
                showError('phone', '请输入联系电话');
                isValid = false;
            } else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(phone)) {
                showError('phone', '请输入有效的电话号码');
                isValid = false;
            }
            
            // 验证咨询内容
            if (!message) {
                showError('message', '请输入咨询内容');
                isValid = false;
            }
            
            // 如果验证通过，可以提交表单
            if (isValid) {
                // 在实际应用中，这里会发送表单数据到服务器
                alert('感谢您的咨询！我们会尽快与您联系。');
                contactForm.reset();
            }
        });
    }
    
    // 显示错误信息的辅助函数
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
    }
    
    // 平滑滚动到页面锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是页面内锚点链接
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // 如果是移动端，关闭菜单
                    if (window.innerWidth <= 992 && nav) {
                        nav.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
});