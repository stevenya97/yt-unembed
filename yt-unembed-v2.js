// ==UserScript==
// @name        Youtube UnEmbed v2
// @description Converts embedded Youtube iframes into image previews or links. This version uses mutation observer for performance
// @version     0.3
// @author      schiffern, eikaramba, stevenya97
// @license     MIT
// @match       *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.reddit.com/*
// @exclude      *://looptube.io/*
// @updateURL   https://raw.githubusercontent.com/stevenya97/yt-unembed/main/yt-unembed-v2.js
// @downloadURL   https://raw.githubusercontent.com/stevenya97/yt-unembed/main/yt-unembed-v2.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() { 'use strict';
  const SITE = "https://www.youtube.com";
  const LINK_TO_TIMESTAMP = true;
  const SHOW_PREVIEW_IMAGE = true;
  const PREVIEW_FORCE_FILL_FRAME = true;

  const createPreviewElement = (videoId, newURL, frame) => {
    const container = document.createElement("div");
    container.setAttribute('data-yt-preview', 'true');
    container.style.position = "relative";
    if(PREVIEW_FORCE_FILL_FRAME){
        container.style.width = frame.parentNode.width + "px";
        container.style.height = frame.parentNode.height + "px";
    }
    container.style.width = frame.parentNode.width + "px";
    container.style.height = frame.parentNode.height + "px";
    container.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    img.alt = "Preview image of Youtube video";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    //img.style.width = frame.width +"px";

    const playButton = document.createElement("div");
    playButton.innerHTML = "▶";
    playButton.style.paddingLeft ="5px";
    playButton.style.position = "absolute";
    playButton.style.top = "50%";
    playButton.style.left = "50%";
    playButton.style.transform = "translate(-50%, -50%)";
    playButton.style.fontSize = "48px";
    playButton.style.color = "white";
    playButton.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    playButton.style.borderRadius = "50%";
    playButton.style.width = "80px";
    playButton.style.height = "80px";
    playButton.style.display = "flex";
    playButton.style.justifyContent = "center";
    playButton.style.alignItems = "center";

    container.appendChild(img);
    container.appendChild(playButton);

    container.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = frame.src + (frame.src.includes('?') ? '&' : '?') + 'autoplay=1';
      iframe.width = frame.width;
      iframe.height = frame.height;
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.setAttribute('data-yt-processed', 'true');
      container.parentNode.replaceChild(iframe, container);
    });

    return container;
  };

  const replaceEmbed = (frame) => {
    const frameURL = frame.src || frame.dataset?.src;
    if (!frameURL) return;
    const match = frameURL.match(/(^https?:)?\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/([a-zA-Z0-9\-_]{11}).*?(\?.*((t|start)=([\dsmh]*)))?/i);
    if (match?.length == 9) {
      const videoId = match[4];
      const newURL = SITE + "/watch?" + ((LINK_TO_TIMESTAMP && match[8]) ? "t=" + match[8] + "&" : "") + "v=" + videoId;

      const previewElement = createPreviewElement(videoId, newURL, frame);
      frame.parentNode.replaceChild(previewElement, frame);

      // common lazyload hiding methods
      previewElement.style.display = "block !important";
      previewElement.style.opacity = "100% !important";
      previewElement.style.background = "transparent !important";
      const parent = previewElement.parentElement;
      if (parent) {
        parent.style.display = "block !important";
        parent.style.opacity = "100% !important";
        parent.style.background = "transparent !important";
      }
    }
  };

  const observeDOM = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'IFRAME' && !node.hasAttribute('data-yt-processed')) {
                replaceEmbed(node);
              } else {
                node.querySelectorAll('iframe:not([data-yt-processed])').forEach(replaceEmbed);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Initial replacement
  document.querySelectorAll('iframe:not([data-yt-processed])').forEach(replaceEmbed);

  // Start observing DOM changes
  observeDOM();
})();
