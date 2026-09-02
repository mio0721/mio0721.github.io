/**
 * 将指定原生 select 增强为圆角毛玻璃下拉菜单。
 *
 * 原生 select 仍保留在 DOM 中并负责 value/change，因此分类视图和
 * 热力图原有逻辑无需重复；自定义按钮只负责一致的视觉和键盘交互。
 */
(() => {
  "use strict";

  const SELECTOR = "#mio-category-view, #mio-heatmap-year";

  const closeAllMenus = except => {
    document.querySelectorAll(".mio-glass-select.is-open").forEach(wrapper => {
      if (wrapper === except) return;
      wrapper.classList.remove("is-open");
      wrapper.querySelector(".mio-glass-select-trigger")?.setAttribute("aria-expanded", "false");
      const menu = wrapper.querySelector(".mio-glass-select-menu");
      if (menu) menu.hidden = true;
    });
  };

  const enhanceSelect = select => {
    if (select.dataset.glassSelectReady === "true") return;

    const wrapper = document.createElement("div");
    const trigger = document.createElement("button");
    const valueText = document.createElement("span");
    const arrow = document.createElement("span");
    const menu = document.createElement("div");
    const menuId = `${select.id}-glass-menu`;

    wrapper.className = "mio-glass-select";
    wrapper.dataset.selectId = select.id;

    trigger.type = "button";
    trigger.className = "mio-glass-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", menuId);
    trigger.setAttribute("aria-label", select.getAttribute("aria-label") || "选择选项");

    valueText.className = "mio-glass-select-value";
    arrow.className = "mio-glass-select-arrow";
    arrow.setAttribute("aria-hidden", "true");
    trigger.append(valueText, arrow);

    menu.id = menuId;
    menu.className = "mio-glass-select-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    Array.from(select.options).forEach(option => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "mio-glass-select-option";
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      item.setAttribute("role", "option");

      item.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        closeAllMenus();
        trigger.focus();
      });

      menu.append(item);
    });

    select.before(wrapper);
    wrapper.append(select, trigger, menu);
    select.classList.add("mio-glass-select-native");
    select.tabIndex = -1;
    select.dataset.glassSelectReady = "true";

    const syncSelection = () => {
      const selected = select.options[select.selectedIndex];
      valueText.textContent = selected?.textContent || "";

      menu.querySelectorAll(".mio-glass-select-option").forEach(item => {
        const isSelected = item.dataset.value === select.value;
        item.classList.toggle("is-selected", isSelected);
        item.setAttribute("aria-selected", String(isSelected));
      });
    };

    const setOpen = shouldOpen => {
      closeAllMenus(shouldOpen ? wrapper : null);
      wrapper.classList.toggle("is-open", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
      menu.hidden = !shouldOpen;

      if (shouldOpen) {
        menu.querySelector(".is-selected")?.focus();
      }
    };

    trigger.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!wrapper.classList.contains("is-open"));
    });

    trigger.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
      }
    });

    menu.addEventListener("keydown", event => {
      const items = Array.from(menu.querySelectorAll(".mio-glass-select-option"));
      const currentIndex = items.indexOf(document.activeElement);

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + direction + items.length) % items.length;
        items[nextIndex]?.focus();
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        items[event.key === "Home" ? 0 : items.length - 1]?.focus();
      }
    });

    select.addEventListener("change", syncSelection);
    syncSelection();
  };

  const initGlassSelects = () => {
    document.querySelectorAll(SELECTOR).forEach(enhanceSelect);
  };

  document.addEventListener("click", () => closeAllMenus());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlassSelects, { once: true });
  } else {
    initGlassSelects();
  }

  document.addEventListener("pjax:complete", initGlassSelects);
})();
