# Youtube UnEmbed
Replaces YT embed iframes with image previews(optionally just links).

Script forked from user `schiffern` and `eikaramba` discussed over on [this thread](https://news.ycombinator.com/item?id=40897205#40898756).

### Installation

[link to userscript](https://raw.githubusercontent.com/stevenya97/yt-unembed/main/yt-unembed.js)

[link to v2 userscript(uses mutation observer for less cpu cycles)](https://raw.githubusercontent.com/stevenya97/yt-unembed/main/yt-unembed-v2.js)


Click on the link, if using a userscript manager it should prompt to install. Else, download/paste it.

### Image previews
To disable previews and just show links, change line 19 `const SHOW_PREVIEW_IMAGE = true;` to read false instead of true.

### userscripts

Included userscript requires a app or browser userscript manager.

Example apps or extensions/add-ons you can use:

Android: AdGuard app (load as extension) iOS: Hyperweb or Userscripts macOS: AdGuard app Windows/ChromeOS: Tampermonkey Chrome extension or Firefox add-on
