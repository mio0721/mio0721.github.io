/*
 * 右下角“欣赏背景”按钮。
 *
 * - 睁眼：页面卡片当前可见，点击后隐藏。
 * - 闭眼：页面卡片当前隐藏，点击后恢复。
 * - 状态只保留在当前页面会话中，刷新浏览器会恢复正常显示。
 * - 使用事件委托兼容 Butterfly 的 PJAX 页面切换。
 */

(() => {
  "use strict";

  const html = document.documentElement;
  const viewClass = "mio-background-view";
  const buttonId = "background-view-btn";


  /** 根据当前状态同步图标、提示文字和无障碍属性。 */
  const updateButton = button => {
    if (!button) return;

    const cardsHidden = html.classList.contains(viewClass);
    const icon = button.querySelector("i");

    button.title = cardsHidden
      ? "显示所有卡片"
      : "隐藏所有卡片，欣赏背景";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", String(cardsHidden));

    if (icon) {
      icon.className = cardsHidden ? "fas fa-eye-slash" : "fas fa-eye";
    }
  };


  /** 将按钮加入右下角折叠设置区，并保持与主题按钮相同的 DOM 结构。 */
  const ensureButton = () => {
    const container = document.querySelector("#rightside-config-hide");
    if (!container) return;

    let button = document.getElementById(buttonId);

    if (!button) {
      button = document.createElement("button");
      button.id = buttonId;
      button.type = "button";
      button.innerHTML = '<i class="fas fa-eye"></i>';

      const asideButton = document.getElementById("hide-aside-btn");
      if (asideButton && asideButton.parentElement === container) {
        asideButton.insertAdjacentElement("afterend", button);
      } else {
        container.appendChild(button);
      }
    }

    updateButton(button);
  };


  /** 脚本可能被 PJAX 再次执行，事件监听器只注册一次。 */
  if (!window.mioBackgroundViewInitialized) {
    window.mioBackgroundViewInitialized = true;

    document.addEventListener("click", event => {
      const button = event.target.closest(`#${buttonId}`);
      if (!button) return;

      html.classList.toggle(viewClass);
      updateButton(button);
    });

    document.addEventListener("pjax:complete", ensureButton);
    document.addEventListener("DOMContentLoaded", ensureButton);
  }

  ensureButton();
})();
