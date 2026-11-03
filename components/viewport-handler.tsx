'use client';

import { useEffect } from 'react';

export function ViewportHandler() {
  useEffect(() => {
    // 1. 动态设置可见视口高度
    const setAppHeight = () => {
      // 增加 fallback，防止 visualViewport 获取失败
      const vh = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    window.visualViewport?.addEventListener('resize', setAppHeight);
    setAppHeight();

    // 2. 监听输入框聚焦/失焦，控制底部安全区 Padding
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        document.body.classList.add('keyboard-open');
        setTimeout(setAppHeight, 100);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // 延迟移除，避免在两个输入框之间切换时闪烁
        setTimeout(() => {
          const activeEl = document.activeElement;
          const isStillEditing =
            activeEl &&
            (activeEl.tagName === 'INPUT' ||
              activeEl.tagName === 'TEXTAREA' ||
              (activeEl as HTMLElement).isContentEditable);
          
          if (!isStillEditing) {
            document.body.classList.remove('keyboard-open');
            
            // 👇 🔥 新增：iOS 键盘收起留白核心修复代码 🔥 👇
            setTimeout(() => {
              // 1. 强制滚动回顶部，消除 WebView 被顶上去下不来的留白
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
              // 2. 强制重新计算一次高度
              setAppHeight();
            }, 100); 
            // 👆 --------------------------------------- 👆
          }
        }, 50);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.visualViewport?.removeEventListener('resize', setAppHeight);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return null;
}
