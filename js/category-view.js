/**
 * 分类总览页的经典 / 知识库视图切换。
 *
 * 视图选择和每个目录节点的展开状态保存在 localStorage 中；
 * 初始化同时兼容普通载入与 Butterfly 的 PJAX 页面切换。
 */
(() => {
  "use strict";

  const VIEW_KEY = "mio-category-view";
  const TREE_KEY_PREFIX = "mio-category-tree:";

  const readStorage = key => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* 隐私模式禁用 localStorage 时，切换功能仍可在当前页面使用。 */
    }
  };

  const initCategoryView = () => {
    const browser = document.querySelector(".mio-category-browser");
    if (!browser || browser.dataset.categoryViewReady === "true") return;

    const select = browser.querySelector("#mio-category-view");
    const views = Array.from(browser.querySelectorAll("[data-category-view]"));
    if (!select || views.length !== 2) return;

    const showView = viewName => {
      const validView = viewName === "knowledge" ? "knowledge" : "classic";

      select.value = validView;
      browser.dataset.activeView = validView;
      views.forEach(view => {
        view.hidden = view.dataset.categoryView !== validView;
      });
      writeStorage(VIEW_KEY, validView);
    };

    const savedView = readStorage(VIEW_KEY);
    showView(savedView || "classic");

    select.addEventListener("change", () => showView(select.value));

    browser.querySelectorAll(".mio-knowledge-details").forEach(details => {
      const storageKey = `${TREE_KEY_PREFIX}${details.dataset.treeKey}`;
      const savedState = readStorage(storageKey);

      if (savedState !== null) details.open = savedState === "open";

      details.addEventListener("toggle", () => {
        writeStorage(storageKey, details.open ? "open" : "closed");
      });
    });

    /* 点击分类名称时进入分类页，不触发同一行的目录折叠。 */
    browser.querySelectorAll(".mio-knowledge-summary a").forEach(link => {
      link.addEventListener("click", event => event.stopPropagation());
    });

    browser.dataset.categoryViewReady = "true";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCategoryView, { once: true });
  } else {
    initCategoryView();
  }

  document.addEventListener("pjax:complete", initCategoryView);
})();
