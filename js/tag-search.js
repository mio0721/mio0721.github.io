/**
 * 标签总览页实时搜索
 *
 * 只在页面中存在 .tag-cloud-list 时初始化，因此不会影响首页、文章页等。
 * 搜索仅匹配标签名称，不搜索文章正文；顶部导航栏搜索负责文章搜索。
 */
(function () {
  "use strict";

  function initTagSearch() {
    const tagCloud = document.querySelector(".tag-cloud-list");

    /* 非标签总览页，或者已经初始化过时直接退出。 */
    if (!tagCloud || document.querySelector(".mio-tag-search")) return;

    const tags = Array.from(tagCloud.querySelectorAll("a"));
    const searchBox = document.createElement("div");
    const status = document.createElement("div");

    searchBox.className = "mio-tag-search";
    searchBox.innerHTML = [
      '<i class="fas fa-search" aria-hidden="true"></i>',
      '<input type="search" placeholder="搜索标签..." aria-label="搜索标签" autocomplete="off">',
      '<button type="button" class="mio-tag-search-clear" aria-label="清空标签搜索" title="清空">',
      '<i class="fas fa-xmark" aria-hidden="true"></i>',
      "</button>"
    ].join("");

    status.className = "mio-tag-search-status";
    status.setAttribute("aria-live", "polite");

    tagCloud.before(searchBox, status);

    const input = searchBox.querySelector("input");
    const clearButton = searchBox.querySelector(".mio-tag-search-clear");

    function filterTags() {
      const keyword = input.value.trim().toLocaleLowerCase();
      let matchedCount = 0;

      tags.forEach(tag => {
        const tagName = tag.textContent.trim().toLocaleLowerCase();
        const matched = !keyword || tagName.includes(keyword);

        tag.hidden = !matched;
        if (matched) matchedCount += 1;
      });

      clearButton.classList.toggle("is-visible", keyword.length > 0);
      tagCloud.classList.toggle("is-empty", matchedCount === 0);

      if (!keyword) {
        status.textContent = `共 ${tags.length} 个标签`;
      } else if (matchedCount > 0) {
        status.textContent = `找到 ${matchedCount} 个标签`;
      } else {
        status.textContent = "没有找到匹配的标签";
      }
    }

    input.addEventListener("input", filterTags);

    input.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        input.value = "";
        filterTags();
      }
    });

    clearButton.addEventListener("click", () => {
      input.value = "";
      filterTags();
      input.focus();
    });

    filterTags();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTagSearch, { once: true });
  } else {
    initTagSearch();
  }
})();
