// script/versionC.js

$(function () {

    const user = getMyInfo();

    if (!user || !user.loginStatus) {
        alert("Debe iniciar sesión para acceder a la compra.");
        window.location.href = "home.html";
        return;
    }

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
    const CARD_NUMBER_REGEX = /^(?:\d{13}|\d{15}|\d{16}|\d{19})$/; // 13,15,16,19 dígitos
    const CVV_REGEX = /^\d{3}$/;

    // Acepta "YYYY-MM" (type=month), "YYYY-MM-DD" (type=date) o "MM / AA" texto
    function isFutureExpiry(raw) {
        if (!raw) return false;

        // Caso "MM / AA"
        if (/^\d{2}\s*\/\s*\d{2}$/.test(raw)) {
            const [mm, aa] = raw.split("/").map(s => s.trim());
            const year = 2000 + parseInt(aa, 10);
            const month = parseInt(mm, 10); // 1-12
            if (month < 1 || month > 12) return false;
            const lastOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
            return lastOfMonth.getTime() > Date.now();
        }

        // Caso "YYYY-MM" o "YYYY-MM-DD"
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return false;

        // Si es "YYYY-MM", JS lo interpreta como día 1 del mes: ajustamos al fin de mes
        let year = d.getFullYear();
        let month = d.getMonth() + 1; // 1..12
        const lastOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        return lastOfMonth.getTime() > Date.now();
    }

    function cleanNumber(str) {
        return (str || "").replace(/\s+/g, "");
    }

    // --- VALIDACIÓN PRINCIPAL ---
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

        return {
            fullName, email, type,
            numberLast4: number.slice(-4),
            owner, expiry
        };
    }

    // --- SUBMIT ---
    $form.on("submit", function (e) {
        e.preventDefault();

        const data = validateForm();
        if (!data) return;

        // (Opcional) Guardar la compra asociada al usuario actual
        // Si quieres activarlo, añade en local_storage_ops.js helpers como addPurchaseForCurrentUser(...)
        // addPurchaseForCurrentUser({ cardType: data.type, last4: data.numberLast4, when: new Date().toISOString() });

        alert("Compra realizada");
        this.reset();
    });

    // El botón Borrar ya es type="reset", no hace falta JS extra
});
