'use client';

import { useEffect } from 'react';

export function ViewportHandler() {
  useEffect(() => {
    // 1. 动态设置可见视口高度
    const setAppHeight = () => {
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
        // 聚焦时再次触发高度计算（应对部分 iOS 延迟）
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
