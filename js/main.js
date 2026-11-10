(function () {
  var pages = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "richard-bong", href: "richard-bong.html", label: "Richard Bong" },
    { id: "pappy-gunn", href: "pappy-gunn.html", label: "Pappy Gunn" },
    { id: "war-daddy", href: "war-daddy.html", label: "War Daddy" },
    { id: "ching-lee", href: "ching-lee.html", label: "Ching Lee" },
    { id: "terrible-terry", href: "terrible-terry.html", label: "Terrible Terry" },
    { id: "go-for-broke", href: "go-for-broke.html", label: "Go For Broke Boys" },
    { id: "eager-beavers", href: "eager-beavers.html", label: "Eager Beavers" },
    { id: "limping-lady", href: "limping-lady.html", label: "Limping Lady" },
    { id: "fighting-preacher", href: "fighting-preacher.html", label: "Fightin\u2019 Preacher" },
    { id: "lyle-bouck", href: "lyle-bouck.html", label: "Lyle Bouck" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("site-header");
    if (header) {
      renderHeader(header);
    }
    initSearch();
    initReadMore();
  });

  function renderHeader(header) {
    var current = document.body.getAttribute("data-page");
    var links = pages.map(function (page) {
      var active = page.id === current;
      return (
        '<li><a href="' + page.href + '"' +
        (active ? ' class="active" aria-current="page"' : "") +
        ">" + page.label + "</a></li>"
      );
    }).join("");

    header.innerHTML =
      '<div class="header-bar">' +
        '<a class="brand" href="index.html">Heroes Erased</a>' +
        '<div class="header-tools">' +
          '<button class="theme-toggle" type="button"></button>' +
          '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">' +
            '<span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>' +
            '<span class="visually-hidden">Open menu</span>' +
          "</button>" +
        "</div>" +
      "</div>" +
      '<nav aria-label="Primary"><ul id="nav-menu" class="nav-links">' + links + "</ul></nav>";

    var menuButton = header.querySelector(".nav-toggle");
    menuButton.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.querySelector(".visually-hidden").textContent = open ? "Close menu" : "Open menu";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        header.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.querySelector(".visually-hidden").textContent = "Open menu";
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && header.classList.contains("is-open")) {
        header.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.querySelector(".visually-hidden").textContent = "Open menu";
      }
    });
  }

  function normalizeName(value) {
    return value.toLowerCase().replace(/[\u2018\u2019\u201B]/g, "'");
  }

  function initSearch() {
    var form = document.querySelector(".search-form");
    var input = document.getElementById("story-search");
    var grid = document.getElementById("card-grid");
    var status = document.getElementById("search-status");
    if (!input || !grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".story-card"));
    var lastMessage = "";

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }

    input.addEventListener("input", function () {
      var query = normalizeName(input.value.trim());
      var shown = 0;

      cards.forEach(function (card) {
        var name = normalizeName(card.querySelector("h2").textContent);
        var match = query === "" || name.indexOf(query) !== -1;
        card.hidden = !match;
        if (match) {
          shown += 1;
        }
      });

      var message = "";
      if (query !== "" && shown === 0) {
        message = "No stories match that name.";
      } else if (query !== "") {
        message = "Showing " + shown + " of " + cards.length + ".";
      }

      if (status && message !== lastMessage) {
        status.textContent = message;
        lastMessage = message;
      }
    });
  }

  function initReadMore() {
    var button = document.querySelector(".read-toggle");
    var more = document.getElementById("bio-more");
    if (!button || !more) {
      return;
    }

    more.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Read more";

    button.addEventListener("click", function () {
      var willOpen = more.hidden;
      more.hidden = !willOpen;
      button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      button.textContent = willOpen ? "Show less" : "Read more";
    });
  }
})();
