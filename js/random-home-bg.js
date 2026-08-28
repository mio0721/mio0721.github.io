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

function applyRandomBackground() {
  const randomImage =
    homeBackgrounds[Math.floor(Math.random() * homeBackgrounds.length)];

  /* 顶部 Banner */
  const pageHeader = document.querySelector("#page-header");

  if (pageHeader) {
    pageHeader.style.backgroundImage = `url("${randomImage}")`;
    pageHeader.style.backgroundSize = "cover";
    pageHeader.style.backgroundPosition = "center";
    pageHeader.style.backgroundRepeat = "no-repeat";
  }

  /* 整站背景 */
  const webBg = document.querySelector("#web_bg");

  if (webBg) {
    webBg.style.backgroundImage = `url("${randomImage}")`;
    webBg.style.backgroundSize = "cover";
    webBg.style.backgroundPosition = "center";
    webBg.style.backgroundRepeat = "no-repeat";
    webBg.style.backgroundAttachment = "fixed";
  }
}

applyRandomBackground();