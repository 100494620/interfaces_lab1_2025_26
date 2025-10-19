// script/versionC.js
$(function () {
    // --- CONTROL DE ACCESO: solo usuarios logeados ---
    // getMyInfo() usa localStorage.username (que guarda el login_name)
    const user = getMyInfo();

    const isLoggedIn = user && user.loginStatus === true;
    if (!isLoggedIn) {
        alert("Debe iniciar sesión para acceder a la compra.");
        // replace() evita que el usuario vuelva con el botón atrás a versionC
        window.location.replace("home.html");
        return; // frenamos el resto del script
    }
    // --- Packs (mismos IDs que usas en el carrusel) ---
    const PACKS = [
        {
            id: "sea-01",
            title: "Pack Sudeste Asiático",
            price: 600,
            desc: "Descubre lo mejor de Vietnam y Camboya en una ruta de 14 días. Recorre templos milenarios, crucéate por la bahía de Ha Long y explora los mercados flotantes del delta del Mekong. Incluye transporte entre ciudades, alojamiento en hostales seleccionados y asistencia local 24/7",
            img:  "images/pack.jpg"
        },
        {
            id: "jpn-02",
            title: "Japón Express 10 días",
            price: 980,
            desc: "Vive una experiencia inolvidable en Japón. Desde los rascacielos de Tokio hasta los templos de Kioto, pasando por el encanto tradicional de Osaka. JR Pass incluido, visitas guiadas, y degustaciones de ramen, sushi y matcha para conocer la auténtica cultura nipona.",
            img:  "images/japan.jpg"
        },
        {
            id: "vnm-03",
            title: "Vietnam Norte-Sur",
            price: 740,
            desc: "Un viaje de contrastes por Vietnam, desde el bullicio de Hanói hasta la energía moderna de Saigón. Navega por la bahía de Ha Long, disfruta de la gastronomía local en Hoi An y viaja en tren nocturno entre paisajes inolvidables. Incluye transporte, alojamiento y guía local",
            img:  "images/japan_carta.jpg"
        },
        {
            id: "de-04",
            title: "Alemania: castillos históricos",
            price: 520,
            desc: "DEmbárcate en un recorrido por los castillos más impresionantes de Alemania: Neuschwanstein, Hohenzollern y Wartburg. Un viaje por bosques, pueblos medievales y la Ruta Romántica bávara. Incluye transporte entre ciudades, entradas y alojamiento con encanto",
            img:  "images/germany.jpg"
        }
    ];

    // --- Util: leer ?pack=... ---
    function getSelectedPackId() {
        const params = new URLSearchParams(window.location.search);
        return params.get("pack");
    }

    // --- PINTAR la info del pack (sin carrusel, solo una vez) ---
    (function paintSelectedPack() {
        const packId = getSelectedPackId();
        const pack = PACKS.find(p => p.id === packId);

        if (!pack) return; // si no hay param o es inválido, dejamos los textos por defecto

        // Top-left: nombre (ya existe el bloque)
        $(".venta-container-left .venta-container-text").text(pack.title);

        // Top-left derecha: precio
        $(".venta-container-right .venta-container-text").text(`€${pack.price}`);

        // Bottom-left: descripción larga
        $(".bottom-left .contenido-text").text(pack.desc);

        // (Opcional) si quieres también cambiar una imagen/fondo de la columna izquierda:
        // $(".left_container").css({
        //   "background-image": `url('${pack.img}')`,
        //   "background-size": "cover",
        //   "background-position": "center"
        // });
    })();


    // ----------------------
    // A partir de aquí, tu lógica de compra/validación (igual que ya tenías)
    // ----------------------

    // --- SELECTORES ---
    const $form = $("#buy");
    const $fullName = $("#FullName");
    const $email = $("#emailLogin");
    const $cardType = $("#cardType");
    const $cardNumber = $("#card-number");
    const $ownerName = $("#owner-name");
    const $expiry = $("#fechaCaducidad");
    const $cvv = $("#codigoCVV");

    // --- REGEX / HELPERS ---
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const CARD_NUMBER_REGEX = /^(?:\d{13}|\d{15}|\d{16}|\d{19})$/;
    const CVV_REGEX = /^\d{3}$/;

    function isFutureExpiry(raw) {
        if (!raw) return false;
        if (/^\d{2}\s*\/\s*\d{2}$/.test(raw)) {
            const [mm, aa] = raw.split("/").map(s => s.trim());
            const year = 2000 + parseInt(aa, 10);
            const month = parseInt(mm, 10);
            if (month < 1 || month > 12) return false;
            const lastOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
            return lastOfMonth.getTime() > Date.now();
        }
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return false;
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        const lastOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        return lastOfMonth.getTime() > Date.now();
    }

    function cleanNumber(str) {
        return (str || "").replace(/\s+/g, "");
    }

    function validateForm() {
        const fullName = $fullName.val().trim();
        const email = $email.val().trim();
        const type = $cardType.val();
        const number = cleanNumber($cardNumber.val());
        const owner = $ownerName.val().trim();
        const expiry = $expiry.val().trim();
        const cvv = $cvv.val().trim();

        if (fullName.length < 3) { alert("Nombre completo: mínimo 3 caracteres."); return false; }
        if (!EMAIL_REGEX.test(email)) { alert("Correo electrónico no válido."); return false; }
        if (!type) { alert("Seleccione el tipo de tarjeta."); return false; }
        if (!CARD_NUMBER_REGEX.test(number)) { alert("Número de tarjeta no válido (13, 15, 16 o 19 dígitos)."); return false; }
        if (owner.length < 3) { alert("Nombre del titular: mínimo 3 caracteres."); return false; }
        if (!isFutureExpiry(expiry)) { alert("La fecha de caducidad debe ser futura."); return false; }
        if (!CVV_REGEX.test(cvv)) { alert("CVV debe contener exactamente 3 dígitos."); return false; }

        return { fullName, email, type, numberLast4: number.slice(-4), owner, expiry };
    }

    $form.on("submit", function (e) {
        e.preventDefault();
        const data = validateForm();
        if (!data) return;
        alert("Compra realizada");
        this.reset();
    });

});
