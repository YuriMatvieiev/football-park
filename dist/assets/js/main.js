/**
 * Best Betting Sites: render star rating from data-stars (e.g. 4, 4.5, 5).
 * Uses star-full.svg, star-half.svg, star-empty.svg.
 */
(function () {
  var STAR_FULL = "assets/img/svg/star-full.svg";
  var STAR_HALF = "assets/img/svg/star-half.svg";
  var STAR_EMPTY = "assets/img/svg/star-empty.svg";

  function renderStars(container) {
    var raw = container.getAttribute("data-stars");
    if (raw == null || raw === "") return;
    var rating = parseFloat(raw, 10);
    if (isNaN(rating) || rating < 0) rating = 0;
    if (rating > 5) rating = 5;

    container.textContent = "";
    var starsWrap = document.createElement("span");
    starsWrap.className = "best-betting-sites-section__stars-icons";

    for (var i = 1; i <= 5; i++) {
      var img = document.createElement("img");
      img.setAttribute("alt", "");
      img.setAttribute("width", "18");
      img.setAttribute("height", "17");
      img.className = "best-betting-sites-section__star";
      if (rating >= i) {
        img.src = STAR_FULL;
      } else if (rating >= i - 0.5) {
        img.src = STAR_HALF;
      } else {
        img.src = STAR_EMPTY;
      }
      starsWrap.appendChild(img);
    }

    container.appendChild(starsWrap);
    var label = document.createElement("span");
    label.className = "best-betting-sites-section__stars-label";
    var ratingSpan = document.createElement("span");
    ratingSpan.className = "best-betting-sites-section__stars-rating";
    ratingSpan.textContent = rating % 1 === 0 ? String(Math.floor(rating)) : String(rating);
    label.appendChild(ratingSpan);
    label.appendChild(document.createTextNode("/5"));
    container.appendChild(label);
  }

  function init() {
    var nodes = document.querySelectorAll(".best-betting-sites-section__stars[data-stars]");
    for (var i = 0; i < nodes.length; i++) {
      renderStars(nodes[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/**
 * Claim bonus slider: one pair of prev/next buttons outside slides; click switches slides.
 */
(function () {
  function initClaimBonusSliders() {
    var wrap = document.querySelector(".claim-bonus-videos__card-wrap");
    if (!wrap) return;

    var track = wrap.querySelector(".claim-bonus-videos__slider-track");
    var prevBtn = wrap.querySelector(".claim-bonus-videos__arrow--prev");
    var nextBtn = wrap.querySelector(".claim-bonus-videos__arrow--next");
    var cards = wrap.querySelectorAll(".claim-bonus-videos__card");
    var total = cards.length;
    if (!track || total === 0) return;

    track.style.width = total * 100 + "%";
    track.style.setProperty("--slide-count", String(total));

    var index = 0;

    function updateTransform() {
      var percent = total > 1 ? (index / total) * 100 : 0;
      track.style.transform = "translateX(-" + percent + "%)";
    }

    function goTo(nextIndex) {
      if (nextIndex < 0) nextIndex = total - 1;
      if (nextIndex >= total) nextIndex = 0;
      index = nextIndex;
      updateTransform();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    updateTransform();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initClaimBonusSliders);
  } else {
    initClaimBonusSliders();
  }
})();

/**
 * Hero news sliders: prev/next arrows switch slides by radio inputs
 */
(function () {
  function initHeroSliders() {
    var sliders = document.querySelectorAll("[data-hero-slider]");
    sliders.forEach(function (slider) {
      var inputs = slider.querySelectorAll(".hero-news__input");
      var prevBtn = slider.querySelector(".hero-news__arrow--prev");
      var nextBtn = slider.querySelector(".hero-news__arrow--next");
      var count = inputs.length;
      if (count === 0) return;

      function getCurrentIndex() {
        for (var i = 0; i < count; i++) {
          if (inputs[i].checked) return i;
        }
        return 0;
      }

      function goTo(index) {
        if (index < 0) index = count - 1;
        if (index >= count) index = 0;
        inputs[index].checked = true;
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          goTo(getCurrentIndex() - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          goTo(getCurrentIndex() + 1);
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroSliders);
  } else {
    initHeroSliders();
  }
})();

/**
 * Match header tabs: switch between Match Overview and Match Odds panels.
 */
(function () {
  function initMatchHeaderTabs() {
    var block = document.querySelector("[data-match-header-tabs]");
    if (!block) return;

    var tabs = block.querySelectorAll(".match-header-tabs__tab");
    var panels = block.querySelectorAll(".match-header-tabs__panel");

    function setActive(tabName) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-tab") === tabName;
        tab.classList.toggle("match-header-tabs__tab--active", isActive);
        tab.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-panel") === tabName;
        panel.classList.toggle("match-header-tabs__panel--active", isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var tabName = this.getAttribute("data-tab");
        if (tabName) setActive(tabName);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMatchHeaderTabs);
  } else {
    initMatchHeaderTabs();
  }
})();

(function () {
  var wrap = document.getElementById("inplay-leagues");
  if (!wrap) return;

  var prev = document.querySelector(".newsletter-inplay__inplay-arrow--prev");
  var next = document.querySelector(".newsletter-inplay__inplay-arrow--next");

  var step = 120;

  if (prev) {
    prev.addEventListener("click", function () {
      wrap.scrollBy({ left: -step, behavior: "smooth" });
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      wrap.scrollBy({ left: step, behavior: "smooth" });
    });
  }

  // Drag to scroll (mouse) — hold left button and move
  (function enableDragScroll(el) {
    var isDown = false;
    var startX;
    var scrollLeftStart;
    var hasMoved = false;

    el.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
      startX = e.pageX;
      scrollLeftStart = el.scrollLeft;
    });

    el.addEventListener("mouseleave", function () {
      isDown = false;
      el.style.cursor = "grab";
      el.style.userSelect = "";
    });

    el.addEventListener("mouseup", function () {
      isDown = false;
      el.style.cursor = "grab";
      el.style.userSelect = "";
    });

    el.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var walk = e.pageX - startX;
      if (Math.abs(walk) > 2) hasMoved = true;
      e.preventDefault();
      el.scrollLeft = scrollLeftStart - walk;
    });

    el.addEventListener("click", function (e) {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  })(wrap);
})();

(function () {
  var wrap = document.querySelector(".predictions-today__cards-wrap");
  if (!wrap) return;

  var isDown = false;
  var startX;
  var scrollLeftStart;
  var hasMoved = false;

  wrap.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    isDown = true;
    hasMoved = false;
    wrap.style.cursor = "grabbing";
    wrap.style.userSelect = "none";
    startX = e.pageX;
    scrollLeftStart = wrap.scrollLeft;
  });

  wrap.addEventListener("mouseleave", function () {
    isDown = false;
    wrap.style.cursor = "grab";
    wrap.style.userSelect = "";
  });

  wrap.addEventListener("mouseup", function () {
    isDown = false;
    wrap.style.cursor = "grab";
    wrap.style.userSelect = "";
  });

  wrap.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    var walk = e.pageX - startX;
    if (Math.abs(walk) > 2) hasMoved = true;
    e.preventDefault();
    wrap.scrollLeft = scrollLeftStart - walk;
  });

  wrap.addEventListener("click", function (e) {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();

/**
 * Team header tabs: switch between Overview and News panels.
 */
(function () {
  function initTeamHeaderTabs() {
    var block = document.querySelector("[data-team-header-tabs]");
    if (!block) return;

    var tabs = block.querySelectorAll(".team-header-tabs__tab");
    var panels = block.querySelectorAll(".team-header-tabs__panel");

    function setActive(tabName) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-tab") === tabName;
        tab.classList.toggle("team-header-tabs__tab--active", isActive);
        tab.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-panel") === tabName;
        panel.classList.toggle("team-header-tabs__panel--active", isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var tabName = this.getAttribute("data-tab");
        if (tabName) setActive(tabName);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTeamHeaderTabs);
  } else {
    initTeamHeaderTabs();
  }
})();
