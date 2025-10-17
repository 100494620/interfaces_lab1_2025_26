// script/carousel.js
(function () {
    if (window.__ksfCarouselInit) return;
    window.__ksfCarouselInit = true;

    $(function () {
        const $container = $(".second_container").first();
        if (!$container.length) return;

        // Packs con su imagen de fondo
        const packs = [
            {
                id: "sea-01",
                title: "Pack Sudeste Asiático",
                price: 600,
                desc: "Vietnam y Camboya: buses, hostales y guía de visados",
                img: "images/pack.jpg"
            },
            {
                id: "jpn-02",
                title: "Japón Express 10 días",
                price: 980,
                desc: "Tokio, Kioto y Osaka: JR Pass, templos y ramen tour",
                img: "images/japan.jpg"
            },
            {
                id: "vnm-03",
                title: "Vietnam Norte-Sur",
                price: 740,
                desc: "Ha Noi, Ha Long y Saigón: buses nocturnos y hostales",
                img: "images/vietnam.jpg"
            },
            {
                id: "de-04",
                title: "Alemania: castillos históricos",
                price: 520,
                desc: "Descubre los castillos de Wierchem, Bamberg y Núremberg",
                img: "images/germany.jpg"
            }
        ];

        // Selectores (solo texto y botón; la imagen va como background del card)
        const $card  = $container.find(".venta-container");
        const $title = $container.find('[data-pack="title"], #packTitle');
        const $price = $container.find('[data-pack="price"], #packPrice');
        const $desc  = $container.find('[data-pack="desc"],  #packDesc');
        const $buy   = $container.find('[data-pack="buy"],   #buyBtn');

        const $btnNext = $container.find(".next-button");
        const $btnPrev = $container.find(".back-button");

        let idx = 0;
        let animating = false;

        // Por si quedó algún <img> accidental dentro, lo ocultamos
        $card.find("img").css("display", "none");

        function setBackground(url) {
            // Cambiamos SOLO el fondo
            $card.css("background-image", `url("${url}")`);
        }

        function render() {
            const p = packs[idx];
            setBackground(p.img);
            $title.text(p.title);
            $price.text(`€${p.price}`);
            $desc.text(p.desc);
            $buy.off("click").on("click", () => {
                window.location.href = `versionC.html?pack=${encodeURIComponent(p.id)}`;
            });
        }

        function animateRender() {
            if (animating) return;
            animating = true;
            $card.stop(true, true).fadeTo(120, 0, function () {
                render();
                $(this).fadeTo(120, 1, () => { animating = false; });
            });
        }

        function next() { idx = (idx + 1) % packs.length; animateRender(); }
        function prev() { idx = (idx - 1 + packs.length) % packs.length; animateRender(); }

        $btnNext.off("click").on("click", (e) => { e.preventDefault(); next(); });
        $btnPrev.off("click").on("click", (e) => { e.preventDefault(); prev(); });

        render();
    });
})();
