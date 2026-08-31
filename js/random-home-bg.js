const homeBackgrounds = [
  "/img/home-bg/home-bg.png",
  "/img/home-bg/home-bg2.png",
  "/img/home-bg/home-bg3.png",
  "/img/home-bg/home-bg4.png",
  "/img/home-bg/home-bg5.jpg",
  "/img/home-bg/home-bg6.png",
  "/img/home-bg/home-bg7.png",
  "/img/home-bg/home-bg8.png",
  "/img/home-bg/home-bg9.png",
  "/img/home-bg/home-bg10.png",
  "/img/home-bg/home-bg11.jpg",
  "/img/home-bg/home-bg12.png",
  "/img/home-bg/home-bg13.png",
  "/img/home-bg/home-bg14.png",
  "/img/home-bg/home-bg15.png",
  "/img/home-bg/home-bg16.jpg"
];

function applyPageBackground() {
  const randomImage =
    homeBackgrounds[Math.floor(Math.random() * homeBackgrounds.length)];

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
  }
}

applyPageBackground();
