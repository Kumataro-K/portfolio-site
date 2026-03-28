// ========================================
// ポートフォリオサイト用JavaScript
// Forest Mood - モダンUI
// ========================================

// DOM要素
const navLinks = document.querySelectorAll('.navbar-nav a');

// ========================================
// ナビゲーション機能
// ========================================

// アクティブリンクの設定
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const linkPage = linkPath.split('/').pop();
        
        link.classList.remove('active');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ========================================
// スムーズスクロール
// ========================================

// ページ内リンクのスムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// ページ読み込み時の初期化
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // アクティブなナビゲーションを設定
    setActiveNavLink();
});

// ========================================
// ユーティリティ関数
// ========================================

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// HTMLから直接呼び出せる関数
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.validateForm = validateForm;
window.smoothScroll = smoothScroll;

console.log('ポートフォリオサイトのJavaScriptが正常に読み込まれました'); 