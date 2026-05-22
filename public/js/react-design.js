(function () {
  function normalize(text) {
    return (text || "").toString().trim().replace(/\s+/g, " ").slice(0, 34);
  }

  function toggleMenu() {
    var navLinks = document.getElementById("navLinks");
    if (!navLinks) return;
    navLinks.classList.toggle("active");
  }

  window.toggleMenu = window.toggleMenu || toggleMenu;

  function markActiveNav() {
    var current = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".nav-links a[href]").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "/") return;
      var cleanHref = href.replace(/\/$/, "") || "/";
      if (cleanHref === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function prepareSections() {
    var nodes = Array.from(document.querySelectorAll("main section, .container.page-body > section, .race-map, .winners-section"));
    var seen = new Set();

    return nodes.map(function (section, index) {
      if (seen.has(section)) return null;
      seen.add(section);

      var titleNode = section.querySelector("h1, h2, .section-title");
      var title = normalize(titleNode ? titleNode.textContent : "");
      if (!title) return null;

      if (!section.id) section.id = "seccion-" + (index + 1);
      return { id: section.id, title: title };
    }).filter(Boolean).slice(0, 5);
  }

  function decorateFields() {
    document.querySelectorAll(".form-group, .field-row").forEach(function (group) {
      if (group.querySelector("input, select, textarea")) {
        group.classList.add("hr-field-ready");
      }
    });
  }

  function applyMotion() {
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.gsap.from(".detail, .cat, .gallery-container figure, .card, .login-container, .perfil-card, .winner-card", {
      autoAlpha: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.045,
      ease: "power2.out",
      clearProps: "transform"
    });
  }

  function mountReactEnhancer(sections) {
    if (!window.React || !window.ReactDOM) return;

    var root = document.createElement("div");
    root.id = "hr-react-enhancer";
    document.body.appendChild(root);

    var e = window.React.createElement;
    var useEffect = window.React.useEffect;
    var useState = window.React.useState;

    function Enhancer() {
      var state = useState(0);
      var progress = state[0];
      var setProgress = state[1];

      useEffect(function () {
        function onScroll() {
          var doc = document.documentElement;
          var max = Math.max(1, doc.scrollHeight - doc.clientHeight);
          setProgress(Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)));
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return function () { window.removeEventListener("scroll", onScroll); };
      }, []);

      var sectionLinks = sections.length > 1
        ? e("nav", { className: "hr-section-nav", "aria-label": "Secciones de la pagina" },
            e("p", { className: "hr-section-nav__title" }, "Secciones"),
            sections.map(function (section) {
              return e("a", { key: section.id, href: "#" + section.id }, section.title);
            })
          )
        : null;

      return e(window.React.Fragment, null,
        e("div", { className: "hr-progress", "aria-hidden": "true", style: { "--hr-scroll": progress + "%" } },
          e("div", { className: "hr-progress__bar" })
        ),
        e("div", { className: "hr-react-shell" },
          sectionLinks,
          e("button", {
            type: "button",
            className: "hr-back-top",
            hidden: progress < 10,
            "aria-label": "Volver arriba",
            onClick: function () { window.scrollTo({ top: 0, behavior: "smooth" }); }
          }, "↑")
        )
      );
    }

    window.ReactDOM.createRoot(root).render(e(Enhancer));
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    var editorialPage = document.querySelector(".editorial-page");
    if (!editorialPage) return;

    document.body.classList.add("has-editorial-page");
    decorateFields();
    var sections = prepareSections();
    mountReactEnhancer(sections);
    applyMotion();
  });
})();
