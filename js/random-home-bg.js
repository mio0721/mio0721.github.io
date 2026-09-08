/* 清单加载失败时使用的备用背景，防止页面出现空白。 */
const fallbackBackgrounds = ["/img/home-bg/home-bg.png"];

/* 用户通过右下角图钉固定的随机图库背景。 */
const pinnedBackgroundStorageKey = "mio-pinned-background";


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


/**
 * 读取已固定的背景。
 *
 * 只有路径仍存在于构建生成的背景清单中时才采用；这样以后删除图片
 * 不会让浏览器继续请求一个已经不存在的旧地址。
 */
function getPinnedBackground(backgroundImages) {
  try {
    const pinnedBackground =
      window.localStorage.getItem(pinnedBackgroundStorageKey) || "";

    if (!pinnedBackground) return "";
    if (backgroundImages.includes(pinnedBackground)) return pinnedBackground;

    window.localStorage.removeItem(pinnedBackgroundStorageKey);
  } catch (error) {
    console.warn("无法读取固定背景记录，将继续使用随机背景。", error);
  }

  return "";
}


function applyPageBackground(backgroundImages) {
  const pinnedBackground = getPinnedBackground(backgroundImages);
  const randomImage =
    pinnedBackground ||
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

  /*
   * 整站只使用 #web_bg 这一层背景。
   * 首页头图保持透明并透出它，避免 iPad 滚动前后由两个容器分别
   * 执行 cover，造成画面突然切换到另一种裁切比例。
   */
  const webBg = document.querySelector("#web_bg");

  if (webBg) {
    webBg.style.backgroundImage = `url("${pageBackground}")`;
    webBg.style.backgroundSize = "cover";
    webBg.style.backgroundPosition = "center";
    webBg.style.backgroundRepeat = "no-repeat";
    webBg.style.backgroundAttachment = "scroll";

    /*
     * 保存当前真实背景路径，供右下角“鉴赏模式”按钮显示图片 ID。
     * 自定义事件用于处理背景清单异步加载晚于按钮初始化的情况。
     */
    webBg.dataset.backgroundPath = pageBackground;
    window.mioCurrentBackground = pageBackground;
    window.mioRandomBackground = randomImage;
    window.mioBackgroundImages = backgroundImages.slice();
    window.mioBackgroundPinStorageKey = pinnedBackgroundStorageKey;
    window.mioBackgroundPinned = Boolean(pinnedBackground);
    document.dispatchEvent(new CustomEvent("mio:background-changed", {
      detail: {
        path: pageBackground,
        randomPath: randomImage,
        pinned: Boolean(pinnedBackground)
      }
    }));
  }
}

loadBackgrounds().then(applyPageBackground);
