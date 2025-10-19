// script/versionB.js
$(function () {
    // --- Constantes / helpers ---
    const ADVICES_LS_KEY = "advices"; // lista común para todos los usuarios

    // Sanitiza texto simple (evita HTML inyectado en el título/enlaces)
    const escapeHtml = (s = "") =>
        s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

    // Genera un id simple (suficiente para esta práctica)
    const newId = () => "adv_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);

    // Carga/guarda en localStorage
    function loadAdvices() {
        try {
            const raw = localStorage.getItem(ADVICES_LS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }
    function saveAdvices(list) {
        localStorage.setItem(ADVICES_LS_KEY, JSON.stringify(list));
    }

    // Renderiza los 3 últimos en #adviceList
    function renderLastThree() {
        const $list = $("#adviceList");
        const all = loadAdvices();

        // Orden por fecha desc (más recientes primero)
        all.sort((a, b) => b.createdAt - a.createdAt);

        const last3 = all.slice(0, 3);

        // Pinta como enlaces a una página “ficticia” de detalle
        // (el enunciado permite que esa página NO exista realmente)
        $list.empty();
        last3.forEach(item => {
            const href = `consejo.html?id=${encodeURIComponent(item.id)}`; // no es necesario que exista
            const $a = $("<a>").attr("href", href).text(item.title);
            $list.append($a).append("<br>");
        });
    }

    // Valida y añade un consejo
    function onSendAdvice() {
        const title = $("#adviceTitle").val().trim();
        const desc  = $("#adviceDesc").val().trim();

        if (title.length < 15) {
            alert("El título debe tener al menos 15 caracteres.");
            return;
        }
        if (desc.length < 30) {
            alert("La descripción debe tener al menos 30 caracteres.");
            return;
        }

        const advices = loadAdvices();

        // Añadir al comienzo (más reciente primero)
        const advice = {
            id: newId(),
            title: escapeHtml(title),
            desc: desc,              // si más adelante pintas la descripción, escápala o ponla como texto
            createdAt: Date.now()
        };
        advices.unshift(advice);

        saveAdvices(advices);
        renderLastThree();

        // Reset de campos
        $("#adviceTitle").val("");
        $("#adviceDesc").val("");
    }

    // Eventos
    $("#adviceSend").on("click", onSendAdvice);

    // Pintado inicial al cargar la página
    renderLastThree();
});
