// 3D globe background for the About Me hero, built on globe.gl (three.js).
// Auto-rotates, lets visitors drag to look around, and highlights whichever
// country is under the cursor. Shows the Rio -> Salzburg -> Olomouc route.
// Colours and the Earth texture follow the site's light/dark theme.
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("globe-canvas");
    if (!container || typeof Globe === "undefined") return;

    const IMG = "https://cdn.jsdelivr.net/npm/three-globe@2.45.3/example/img/";
    const PALETTES = {
        dark: {
            texture: IMG + "earth-dark.jpg",
            accent: "#2dd4bf", // matches --accent
            accentDim: "rgba(45, 212, 191, 0.25)",
            route: "#fbbf24", // amber, stands out against the teal grid
        },
        light: {
            texture: IMG + "earth-blue-marble.jpg",
            accent: "#0f766e",
            accentDim: "rgba(255, 255, 255, 0.45)",
            route: "#f59e0b",
        },
    };
    let palette = PALETTES[document.documentElement.getAttribute("data-theme")] || PALETTES.dark;
    let hovered = null;

    const COUNTRIES_URL = "https://cdn.jsdelivr.net/gh/vasturiano/globe.gl@v2.46.1/example/datasets/ne_110m_admin_0_countries.geojson";

    const ROUTE_STOPS = [
        { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
        { name: "Salzburg", lat: 47.8095, lng: 13.055 },
        { name: "Olomouc", lat: 49.5938, lng: 17.2509 },
    ];

    const routeArcs = [];
    for (let i = 0; i < ROUTE_STOPS.length - 1; i++) {
        routeArcs.push({
            startLat: ROUTE_STOPS[i].lat,
            startLng: ROUTE_STOPS[i].lng,
            endLat: ROUTE_STOPS[i + 1].lat,
            endLng: ROUTE_STOPS[i + 1].lng,
        });
    }

    const world = new Globe(container)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereAltitude(0.18)
        .polygonsData([])
        .polygonSideColor(() => "rgba(0, 0, 0, 0)")
        .polygonLabel((d) => (d.properties && d.properties.ADMIN) || "")
        .onPolygonHover((hoverD) => {
            hovered = hoverD;
            paintPolygons();
        })
        .arcsData(routeArcs)
        .arcAltitude(0.28)
        .arcStroke(0.4)
        .arcDashLength(0.4)
        .arcDashGap(0.15)
        .arcDashAnimateTime(4000)
        .pointsData(ROUTE_STOPS)
        .pointLabel("name")
        .pointRadius(0.35)
        .pointAltitude(0.012);

    function paintPolygons() {
        world
            .polygonAltitude((d) => (d === hovered ? 0.02 : 0.003))
            .polygonCapColor((d) => (d === hovered ? palette.accentDim : "rgba(0, 0, 0, 0)"))
            .polygonStrokeColor((d) => (d === hovered ? palette.accent : palette.accentDim));
    }

    function applyPalette() {
        world
            .globeImageUrl(palette.texture)
            .atmosphereColor(palette.accent)
            .arcColor(() => palette.route)
            .pointColor(() => palette.route);
        paintPolygons();
    }

    applyPalette();

    document.addEventListener("themechange", (e) => {
        palette = PALETTES[e.detail] || PALETTES.dark;
        applyPalette();
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const controls = world.controls();
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false;
    controls.enablePan = false;

    function resize() {
        const rect = container.getBoundingClientRect();
        world.width(rect.width).height(rect.height);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    fetch(COUNTRIES_URL)
        .then((res) => res.json())
        .then((geojson) => {
            world.polygonsData(
                geojson.features.filter((d) => d.properties && d.properties.ADMIN && d.properties.ISO_A2 !== "AQ")
            );
        })
        .catch((err) => {
            console.warn("Globe: could not load country borders.", err);
        });
});
