/*
 * 移动端侧滑菜单增强：
 * 1. 在菜单右上角添加明确的关闭按钮；
 * 2. 支持按 Esc 键关闭菜单；
 * 3. 复用 Butterfly 原有的 #menu-mask 点击逻辑，不改主题核心脚本。
 */
(function () {
  "use strict";

  function closeMobileMenu() {
    const sidebarMenus = document.getElementById("sidebar-menus");
    const menuMask = document.getElementById("menu-mask");

    if (!sidebarMenus || !sidebarMenus.classList.contains("open")) return;

    /* Butterfly 已经在遮罩上绑定了完整的关闭动画与滚动恢复逻辑 */
    if (menuMask) menuMask.click();
  }

  function setupMobileMenu() {
    const sidebarMenus = document.getElementById("sidebar-menus");

    if (!sidebarMenus || sidebarMenus.querySelector(".mio-sidebar-close")) return;

    const closeButton = document.createElement("button");
    closeButton.className = "mio-sidebar-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "关闭导航菜单");
    closeButton.title = "关闭菜单";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", closeMobileMenu);

    sidebarMenus.prepend(closeButton);
  }

  setupMobileMenu();
  document.addEventListener("pjax:complete", setupMobileMenu);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMobileMenu();
  });
})();
