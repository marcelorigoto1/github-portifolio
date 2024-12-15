// Handle hover image swapping for projects
document.addEventListener("DOMContentLoaded", () => {
    const projectImages = document.querySelectorAll(".project img");

    projectImages.forEach((img) => {
        const originalSrc = img.getAttribute("src"); // Save the original image source
        const hoverSrc = img.getAttribute("data-hover"); // Get the hover image source

        img.addEventListener("mouseenter", () => {
            if (hoverSrc) img.src = hoverSrc; // Change to hover image when hovered
        });

        img.addEventListener("mouseleave", () => {
            img.src = originalSrc; // Revert to original image when no longer hovered
        });
    });
});

// Highlight active section in the navbar as user scrolls
document.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navbarLinks = document.querySelectorAll(".navbar-links a");

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100; // Adjust for navbar height
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            const id = section.getAttribute("id");

            navbarLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href").substring(1) === id) {
                    link.classList.add("active");
                }
            });
        }
    });
});
