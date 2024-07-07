// ==UserScript==
// @name         Youtube UnEmbed
// @version      0.2
// @description  Converts embedded Youtube iframes into links
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.reddit.com/*
// @exclude      *://looptube.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/stevenya97/yt-unembed/main/yt-unembed.js
// @run-at       document-idle
// ==/UserScript==

  (function() {
  'use strict';

  const SITE = "https://www.youtube.com"; //m.youtube Invidious etc
  const LINK_TO_TIMESTAMP = true;
  const SHOW_PREVIEW_IMAGE = false;

  const replaceEmbeds = () => {
    document.querySelectorAll('iframe').forEach((frame) => {
      const frameURL = frame.src || frame.dataset?.src;
      if (!frameURL) return;
      const match = frameURL.match(/(^https?:)?\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/([a-zA-Z0-9\-_]{11}).*?(\?.*((t|start)=([\dsmh]*)))?/i);
      if (match?.length == 9) {
        const newURL = SITE+"/watch?" + ((LINK_TO_TIMESTAMP && match[8]) ? "t="+match[8]+"&" : "") + "v="+match[4];
        const elem = document.createElement("a")
        elem.href = newURL;
        if (SHOW_PREVIEW_IMAGE) {
          let img = document.createElement("img");
          img.src = "https://i.ytimg.com/vi/"+match[4]+"/mqdefault.jpg";
          img.alt="Preview image of Youtube video";
          // 320 x 180 preview. For more resolution options see
          // https://medium.com/@viniciu_/how-to-get-the-default-thumbnail-url-for-a-youtube-video-b5497b3b6218
          elem.appendChild(img);
        } else {
          elem.innerHTML = newURL;
        }

        frame.outerHTML = elem.outerHTML;

        // common lazyload hiding methods
        elem.style.display = "block !important";
        elem.style.opacity = "100% !important";
        elem.style.background = "transparent !important";
        const parent = elem.parentElement;
        if (parent) {
          parent.style.display = "block !important";
          parent.style.opacity = "100% !important";
          parent.style.background = "transparent !important";
        }


      }
    });
  };

  replaceEmbeds();
  setInterval(replaceEmbeds, 3000);
  })();
