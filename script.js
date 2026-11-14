// 鲸鱼灯官网改版 · 轻交互（复制下载链接 / 顶栏滚动态 / 入场动画）
(function () {
  "use strict";

  var DOWNLOAD_URL =
    "https://github.com/mraphasia/whale-lamp-releases/releases/latest/download/whale-lamp-onedir.zip";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 顶栏滚动后加深阴影 */
  var head = document.querySelector(".site-head");
  function syncHead() {
    if (!head) return;
    if (window.scrollY > 8) {
      head.classList.add("is-scrolled");
    } else {
      head.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", syncHead, { passive: true });
  syncHead();

  /* 入场：进入视口后显示；不支持 IntersectionObserver 时直接显示 */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* 复制下载链接 */
  var toast = document.querySelector(".toast");
  var toastTimer = null;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyDownload() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(DOWNLOAD_URL).then(function () {
        showToast("下载链接已复制");
      }).catch(function () {
        showToast(legacyCopy(DOWNLOAD_URL) ? "下载链接已复制" : "复制失败，请手动选择链接");
      });
      return;
    }
    showToast(legacyCopy(DOWNLOAD_URL) ? "下载链接已复制" : "复制失败，请手动选择链接");
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-copy-link]"),
    function (btn) {
      btn.addEventListener("click", copyDownload);
    }
  );
})();
