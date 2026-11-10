(function () {
  var THEME_KEY = "theme";
  var NAME_PREFIX = "theme=";

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function themeFromName() {
    if (window.name.indexOf(NAME_PREFIX) === 0) {
      var value = window.name.slice(NAME_PREFIX.length);
      if (isTheme(value)) {
        return value;
      }
    }
    return "";
  }

  function themeFromUrl() {
    var query = window.location.search.replace(/^\?/, "");
    if (!query) {
      return "";
    }
    var parts = query.split("&");
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split("=");
      if (decodeURIComponent(pair[0] || "") === THEME_KEY) {
        var value = decodeURIComponent(pair[1] || "");
        if (isTheme(value)) {
          return value;
        }
      }
    }
    return "";
  }

  function themeFromStorage() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (isTheme(saved)) {
        return saved;
      }
    } catch (error) {
      return "";
    }
    return "";
  }

  function readSharedTheme() {
    return themeFromUrl() || themeFromName() || themeFromStorage() || "dark";
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function remember(theme) {
    window.name = NAME_PREFIX + theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      return;
    }
  }

  function labelFor(theme) {
    return theme === "light" ? "LIGHT" : "DARK";
  }

  function paintButton(theme) {
    var button = document.querySelector(".theme-toggle");
    if (!button) {
      return;
    }
    button.textContent = labelFor(theme);
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    button.setAttribute("aria-label", "Switch to " + (theme === "light" ? "dark" : "light") + " mode");
  }

  function isSitePage(href) {
    if (!href || href.charAt(0) === "#") {
      return false;
    }
    if (/^[a-z]+:/i.test(href)) {
      return false;
    }
    var path = href.split("#")[0].split("?")[0];
    return /\.html$/.test(path);
  }

  function withTheme(href, theme) {
    var hash = "";
    var hashIndex = href.indexOf("#");
    if (hashIndex >= 0) {
      hash = href.slice(hashIndex);
      href = href.slice(0, hashIndex);
    }
    var path = href.split("?")[0];
    return path + "?theme=" + theme + hash;
  }

  function stampLinks(theme) {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (isSitePage(href)) {
        links[i].setAttribute("href", withTheme(href, theme));
      }
    }
  }

  function cleanThemeParam() {
    if (!themeFromUrl()) {
      return;
    }
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete(THEME_KEY);
      history.replaceState(null, "", url.href);
    } catch (error) {
      return;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    remember(theme);
    paintButton(theme);
    if (document.body) {
      stampLinks(theme);
    }
  }

  applyTheme(readSharedTheme());
  cleanThemeParam();

  function bindToggle() {
    stampLinks(currentTheme());
    paintButton(currentTheme());

    var button = document.querySelector(".theme-toggle");
    if (!button || button.getAttribute("data-theme-bound") === "true") {
      return;
    }

    button.setAttribute("data-theme-bound", "true");
    button.addEventListener("click", function () {
      applyTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  document.addEventListener("click", function (event) {
    var node = event.target;
    while (node && node !== document) {
      if (node.tagName === "A" && isSitePage(node.getAttribute("href"))) {
        var theme = currentTheme();
        window.name = NAME_PREFIX + theme;
        node.setAttribute("href", withTheme(node.getAttribute("href"), theme));
        return;
      }
      node = node.parentNode;
    }
  }, true);

  window.addEventListener("pageshow", function () {
    applyTheme(readSharedTheme());
  });

  window.addEventListener("storage", function (event) {
    if (event.key === THEME_KEY && isTheme(event.newValue)) {
      applyTheme(event.newValue);
    }
  });

  if (document.readyState === "loading" || document.readyState === "interactive") {
    document.addEventListener("DOMContentLoaded", bindToggle);
  } else {
    bindToggle();
  }
})();
