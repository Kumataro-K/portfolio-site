// ========================================
// ポートフォリオサイト用JavaScript
// Cloudflare Pages デプロイ対応
// ========================================

'use strict';

// DOM要素の取得
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

// ========================================
// サイドバーの開閉機能
// ========================================
function toggleSidebar() {
    sidebar.classList.toggle('closed');
    mainContent.classList.toggle('expanded');
    
    // ハンバーガーメニューのアニメーション
    const spans = sidebarToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (sidebar.classList.contains('closed')) {
            // 閉じる時のアニメーション
            if (index === 0) span.style.transform = 'rotate(0) translateY(0)';
            if (index === 1) span.style.opacity = '1';
            if (index === 2) span.style.transform = 'rotate(0) translateY(0)';
        } else {
            // 開く時のアニメーション
            if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
        }
    });
}

// サイドバートグルのイベントリスナー
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

// ========================================
// ナビゲーションのアクティブ状態管理
// ========================================
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        link.classList.remove('active');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ========================================
// 作品フィルター機能
// ========================================
function filterWorks(category) {
    workCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            // 作品カードにカテゴリデータ属性があるかチェック
            const cardCategories = card.dataset.category || '';
            if (cardCategories.includes(category)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
}

// フィルターボタンのイベントリスナー
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // アクティブ状態の更新
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // フィルター実行
        const filter = btn.dataset.filter;
        filterWorks(filter);
    });
});

// ========================================
// スムーズスクロール機能
// ========================================
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80; // ヘッダーの高さ分オフセット
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// スクロール時のアニメーション
// ========================================
function handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    // フェードインアニメーション
    const fadeElements = document.querySelectorAll('section');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('fade-in');
        }
    });
}

// ========================================
// 画像の遅延読み込み
// ========================================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                
                img.onload = () => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// テーマ切り替え機能（オプション）
// ========================================
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// テーマの初期化
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// ========================================
// フォームバリデーション（コンタクトフォーム用）
// ========================================
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const required = input.hasAttribute('required');
        
        if (required && !value) {
            showError(input, 'この項目は必須です');
            isValid = false;
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, '有効なメールアドレスを入力してください');
                isValid = false;
            } else {
                clearError(input);
            }
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    clearError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '5px';
    
    input.style.borderColor = '#dc3545';
    input.parentNode.appendChild(errorElement);
}

function clearError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    input.style.borderColor = '';
}

// ========================================
// ローディングアニメーション
// ========================================
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ========================================
// ページ遷移時の処理
// ========================================
function handlePageTransition() {
    // ローディング画面を非表示
    hideLoadingScreen();
    
    // アクティブなナビゲーションを設定
    setActiveNavLink();
    
    // 画像の遅延読み込みを初期化
    lazyLoadImages();
    
    // テーマを初期化
    initTheme();
}

// ========================================
// イベントリスナーの設定
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // ページ遷移時の処理を実行
    handlePageTransition();
    
    // スクロールイベント
    window.addEventListener('scroll', handleScroll);
    
    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
        // スマートフォンサイズの場合、サイドバーを自動的に閉じる
        if (window.innerWidth <= 480 && !sidebar.classList.contains('closed')) {
            toggleSidebar();
        }
    });
    
    // キーボードナビゲーション対応
    document.addEventListener('keydown', (e) => {
        // ESCキーでサイドバーを閉じる
        if (e.key === 'Escape' && !sidebar.classList.contains('closed')) {
            toggleSidebar();
        }
    });
    
    // 外部クリックでサイドバーを閉じる（モバイルのみ）
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 480) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggle = sidebarToggle.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && !sidebar.classList.contains('closed')) {
                toggleSidebar();
            }
        }
    });
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

// ========================================
// パフォーマンス最適化
// ========================================

// スクロールイベントを最適化
const optimizedHandleScroll = throttle(handleScroll, 100);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedHandleScroll);

// リサイズイベントを最適化
const optimizedResize = debounce(() => {
    if (window.innerWidth <= 480 && !sidebar.classList.contains('closed')) {
        toggleSidebar();
    }
}, 250);
window.addEventListener('resize', optimizedResize);

// ========================================
// アクセシビリティ対応
// ========================================

// フォーカストラップ機能
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ========================================
// エラーハンドリング
// ========================================

window.addEventListener('error', (e) => {
    console.error('JavaScriptエラーが発生しました:', e.error);
    // 本番環境ではエラーログサービスに送信
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未処理のPromise rejection:', e.reason);
});

// ========================================
// サービスワーカー登録（PWA対応）
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker登録成功:', registration);
            })
            .catch((error) => {
                console.log('ServiceWorker登録失敗:', error);
            });
    });
}

// ========================================
// グローバル関数のエクスポート
// ========================================

// HTMLから直接呼び出せる関数
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.validateForm = validateForm;
window.smoothScroll = smoothScroll;

console.log('ポートフォリオサイトのJavaScriptが正常に読み込まれました'); 