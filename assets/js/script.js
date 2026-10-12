// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".navbar-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const open = navLinks.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", String(open));
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("nav-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
});

// Light/dark theme. The inline script in <head> has already set data-theme
// (saved choice, else OS preference); this wires up the toggle button and
// keeps following the OS setting until the visitor picks a theme explicitly.
(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: light)");

    function savedTheme() {
        try {
            return localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
        document.querySelectorAll(".theme-toggle").forEach((btn) => {
            btn.setAttribute("aria-label", label);
            btn.title = label;
        });
        document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
    }

    // Reveal the new theme as a circle growing from the clicked button until it
    // covers the farthest corner of the viewport. Falls back to an instant
    // switch where View Transitions are unsupported or motion is reduced.
    const REVEAL_MS = 700;

    function switchThemeFrom(btn, theme) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || reduceMotion) {
            applyTheme(theme);
            return;
        }

        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        // Per-element colour transitions would otherwise show up mid-fade inside the circle.
        root.classList.add("theme-switching");
        const transition = document.startViewTransition(() => applyTheme(theme));
        transition.finished.finally(() => root.classList.remove("theme-switching"));
        transition.ready
            .then(() => {
                root.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    {
                        duration: REVEAL_MS,
                        easing: "cubic-bezier(0.45, 0, 0.25, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            })
            .catch(() => {
                // Transition skipped (e.g. tab hidden): the theme is already applied.
            });
    }

    media.addEventListener("change", (e) => {
        if (!savedTheme()) applyTheme(e.matches ? "light" : "dark");
    });

    document.addEventListener("DOMContentLoaded", () => {
        applyTheme(root.getAttribute("data-theme") || (media.matches ? "light" : "dark"));

        document.querySelectorAll(".theme-toggle").forEach((btn) => {
            btn.addEventListener("click", () => {
                const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
                try {
                    localStorage.setItem("theme", next);
                } catch (e) {
                    // Storage blocked (private mode): the switch still works for this page.
                }
                switchThemeFrom(btn, next);
            });
        });
    });
})();
