/* 清单加载失败时使用的备用背景，防止页面出现空白。 */
const fallbackBackgrounds = ["/img/home-bg/home-bg.png"];


/**
 * 读取 Hexo 构建时自动生成的背景清单。
 * cache: "no-store" 确保新增图片并重新部署后无需修改版本号。
 */
async function loadBackgrounds() {
  try {
    const response = await fetch(`/background-images.json?t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const images = await response.json();
    return Array.isArray(images) && images.length ? images : fallbackBackgrounds;
  } catch (error) {
    console.warn("随机背景清单加载失败，已使用备用背景。", error);
    return fallbackBackgrounds;
  }
}


function applyPageBackground(backgroundImages) {
  const randomImage =
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  /*
   * 文章背景优先级：top_img（头图）> cover（封面）> 随机图库。
   * Butterfly 会将文章配置中的图片地址写入对应的全局字段。
   */
  const postTopImg =
    window.GLOBAL_CONFIG_SITE &&
    window.GLOBAL_CONFIG_SITE.pageType === "post" &&
    typeof window.GLOBAL_CONFIG_SITE.postTopImg === "string"
      ? window.GLOBAL_CONFIG_SITE.postTopImg
      : "";

  const postCover =
    window.GLOBAL_CONFIG_SITE &&
    window.GLOBAL_CONFIG_SITE.pageType === "post" &&
    typeof window.GLOBAL_CONFIG_SITE.postCover === "string"
      ? window.GLOBAL_CONFIG_SITE.postCover
      : "";

  const pageBackground = postTopImg || postCover || randomImage;

  /* 顶部 Banner */
  const pageHeader = document.querySelector("#page-header");

  /*
   * 只有首页拥有独立大头图。
   * 文章、归档、标签和分类页的顶部已改为透明，直接透出 #web_bg。
   */
  if (pageHeader && pageHeader.classList.contains("full_page")) {
    pageHeader.style.backgroundImage = `url("${randomImage}")`;
    pageHeader.style.backgroundSize = "cover";
    pageHeader.style.backgroundPosition = "center";
    pageHeader.style.backgroundRepeat = "no-repeat";
  }

  /* 整站背景 */
  const webBg = document.querySelector("#web_bg");

  if (webBg) {
    webBg.style.backgroundImage = `url("${pageBackground}")`;
    webBg.style.backgroundSize = "cover";
    webBg.style.backgroundPosition = "center";
    webBg.style.backgroundRepeat = "no-repeat";
    webBg.style.backgroundAttachment = "fixed";

    /*
     * 保存当前真实背景路径，供右下角“鉴赏模式”按钮显示图片 ID。
     * 自定义事件用于处理背景清单异步加载晚于按钮初始化的情况。
     */
    webBg.dataset.backgroundPath = pageBackground;
    window.mioCurrentBackground = pageBackground;
    document.dispatchEvent(new CustomEvent("mio:background-changed", {
      detail: { path: pageBackground }
    }));
  }
}

loadBackgrounds().then(applyPageBackground);
