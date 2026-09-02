/**
 * 防止文章页固定导航中的长标题与居中菜单重叠。
 *
 * 桌面端菜单使用绝对居中，原本不参与 #blog-info 的 Flex 宽度计算。
 * 因此这里读取菜单真实左边界，为左侧标题留下安全间距；菜单折叠为
 * 汉堡按钮或进入移动端后，则清除这个额外宽度限制。
 */
(() => {
  "use strict";

  let frameId = 0;

  const fitNavTitle = () => {
    frameId = 0;

    const nav = document.getElementById("nav");
    const blogInfo = document.getElementById("blog-info");
    const menuItems = nav?.querySelector(".menus_items");

    if (!nav || !blogInfo) return;

    if (
      window.innerWidth <= 768 ||
      !menuItems ||
      window.getComputedStyle(menuItems).display === "none"
    ) {
      blogInfo.style.removeProperty("max-width");
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const menuRect = menuItems.getBoundingClientRect();
    const navStyle = window.getComputedStyle(nav);
    const paddingLeft = Number.parseFloat(navStyle.paddingLeft) || 0;
    const safetyGap = 20;
    const availableWidth = Math.floor(
      menuRect.left - navRect.left - paddingLeft - safetyGap
    );

    if (availableWidth > 0) {
      /* 极窄情况下宁可只保留返回图标，也不能让标题压到菜单下面。 */
      blogInfo.style.maxWidth = `${Math.max(44, availableWidth)}px`;
    }
  };

  const scheduleFit = () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = window.requestAnimationFrame(fitNavTitle);
  };

  window.addEventListener("resize", scheduleFit, { passive: true });
  window.addEventListener("load", scheduleFit, { once: true });
  document.addEventListener("pjax:complete", scheduleFit);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleFit, { once: true });
  } else {
    scheduleFit();
  }

  if (document.fonts?.ready) document.fonts.ready.then(scheduleFit);
})();
