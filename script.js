document.addEventListener("DOMContentLoaded", function () {

    // ================= SELECTS =================

const organismoSelect = document.getElementById("organismo");
const regionSelect = document.getElementById("region");
const ciudadSelect = document.getElementById("ciudad");
    
    // Botón "Seleccionar todo" global para ambos checklists
    const btnSelectAllGlobal = document.querySelector('.select-all-global');

    function toggleGlobalSelectAll(btn) {
        const inputs = Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));
        if (!inputs.length) return;
        const anyUnchecked = inputs.some(i => !i.checked);
        inputs.forEach(i => i.checked = anyUnchecked);
        // Si estamos deseleccionando todo, limpiar marcas de 'user-checked' para evitar flags obsoletos
        if (!anyUnchecked) {
            inputs.forEach(i => delete i.dataset.userChecked);
        }
        if (btn) {
            const textEl = btn.querySelector('.btn-text');
            if (textEl) textEl.textContent = anyUnchecked ? 'Deseleccionar todo' : 'Seleccionar todo';
            else btn.textContent = anyUnchecked ? 'Deseleccionar todo' : 'Seleccionar todo';
        }
    }

    if (btnSelectAllGlobal) {
        // Inicializar estado del botón según si ya hay casillas marcadas

        (function(){
            const inputs = Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));
            if (inputs.length && inputs.every(i => i.checked)) {
                const textEl = btnSelectAllGlobal.querySelector('.btn-text');
                if (textEl) textEl.textContent = 'Deseleccionar todo';
            }
        })();

        // Habilitar el botón solo después de una interacción manual (event.isTrusted)
        const allCheckboxes = Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));

        function updateGlobalButtonState(){
            const anyChecked = document.querySelectorAll('.checklist input[type="checkbox"]:checked').length > 0;
            btnSelectAllGlobal.disabled = !anyChecked;
        }

        allCheckboxes.forEach(cb => {
            cb.addEventListener('change', function(e){
                // Cualquier cambio (manual o programático) actualiza el estado del botón
                updateGlobalButtonState();
            });
        });

        // Ejecutar una vez por si hay estado previo
        updateGlobalButtonState();

        btnSelectAllGlobal.addEventListener('click', (ev) => {
            if (btnSelectAllGlobal.disabled) return;
            toggleGlobalSelectAll(btnSelectAllGlobal);
            // después de la acción, actualizar el estado (por si se deseleccionó todo)
            updateGlobalButtonState();
        });
    }


// ================= CARGAR REGIONES =================

Object.keys(regionesComunas).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
});


// ================= REGIÓN → CARGAR COMUNAS =================

regionSelect.addEventListener("change", function () {

    ciudadSelect.innerHTML = '<option value="">Seleccione Comuna</option>';

    const comunas = regionesComunas[this.value];

    if (comunas) {
        comunas.forEach(comuna => {
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            ciudadSelect.appendChild(option);
        });
    }
});


// ================= CARGAR ORGANISMOS =================

// Ordenar listas
serviciosSalud.sort();
seremisSalud.sort();

const grupoServicios = document.createElement("optgroup");
grupoServicios.label = "Servicios de Salud";

serviciosSalud.forEach(servicio => {
    const option = document.createElement("option");
    option.value = servicio;
    option.textContent = servicio;
    grupoServicios.appendChild(option);
});

const grupoSeremi = document.createElement("optgroup");
grupoSeremi.label = "SEREMI de Salud";

seremisSalud.forEach(seremi => {
    const option = document.createElement("option");
    option.value = seremi;
    option.textContent = seremi;
    grupoSeremi.appendChild(option);
});

organismoSelect.appendChild(grupoServicios);
organismoSelect.appendChild(grupoSeremi);


// ================= ORGANISMO → AUTOSELECCIONAR REGIÓN =================

organismoSelect.addEventListener("change", function () {

    const region = organismoRegionMap[this.value];

    if (region) {

        regionSelect.value = region;

        // Disparar evento para cargar comunas
        regionSelect.dispatchEvent(new Event("change"));

        // Dejar comuna para selección manual
        ciudadSelect.value = "";
    }
});

  // ================= FORMATEAR RUT =================

function formatearRut(rut) {
    rut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rut.length <= 1) return rut;

    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return cuerpo + "-" + dv;
}

// ================= VALIDAR RUT =================

function validarRut(rut) {

    rut = rut.replace(/\./g, '').toUpperCase();

    const rutRegex = /^[0-9]{1,8}-[0-9K]{1}$/;
    if (!rutRegex.test(rut)) return false;

    const [cuerpo, dv] = rut.split('-');

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    let dvEsperado = 11 - (suma % 11);

    if (dvEsperado === 11) dvEsperado = "0";
    else if (dvEsperado === 10) dvEsperado = "K";
    else dvEsperado = dvEsperado.toString();

    return dv === dvEsperado;
}

// ================= VALIDACIÓN EN TIEMPO REAL =================

function activarValidacionRut(inputId, errorId) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.addEventListener("input", function () {

        this.value = formatearRut(this.value);

        if (this.value.length < 3) {
            error.style.display = "none";
            input.classList.remove("input-error", "input-valid");
            return;
        }

        if (validarRut(this.value)) {

            error.textContent = "✔ RUT válido";
            error.classList.remove("invalid-message");
            error.classList.add("valid-message");
            error.style.display = "block";

            input.classList.remove("input-error");
            input.classList.add("input-valid");

        } else {

            error.textContent = "RUT ingresado incorrecto";
            error.classList.remove("valid-message");
            error.classList.add("invalid-message");
            error.style.display = "block";

            input.classList.remove("input-valid");
            input.classList.add("input-error");
        }
    });
}

// Activar validación en ambos campos RUT
activarValidacionRut("rutUsuario", "errorRutUsuario");
activarValidacionRut("rutTecnico", "errorRutTecnico");

// ================= VALIDACIÓN EMAIL =================

function activarValidacionEmail(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!input || !error) return;

    const validar = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    input.addEventListener("input", function () {
        const val = this.value.trim();
        if (!val) {
            error.style.display = "none";
            input.classList.remove("input-error", "input-valid");
            return;
        }
        if (validar(val)) {
            error.textContent = "✔ Email válido";
            error.className = "error-message valid-message";
            error.style.display = "block";
            input.classList.remove("input-error");
            input.classList.add("input-valid");
        } else {
            error.textContent = "Ingrese un email válido (ej: nombre@dominio.cl)";
            error.className = "error-message invalid-message";
            error.style.display = "block";
            input.classList.remove("input-valid");
            input.classList.add("input-error");
        }
    });

    input.addEventListener("blur", function () {
        if (!this.value.trim()) {
            error.style.display = "none";
            input.classList.remove("input-error", "input-valid");
        }
    });
}

activarValidacionEmail("emailUsuario", "errorEmailUsuario");
activarValidacionEmail("correoUsuario", "errorCorreoUsuario");

// ================= VALIDACIÓN TELÉFONO =================

function activarValidacionTelefono(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!input || !error) return;

    const validar = val => /^\d{7,15}$/.test(val.replace(/[\s\-().+]/g, ''));

    input.addEventListener("input", function () {
        const val = this.value.trim();
        if (!val) {
            error.style.display = "none";
            input.classList.remove("input-error", "input-valid");
            return;
        }
        if (validar(val)) {
            error.textContent = "✔ Teléfono válido";
            error.className = "error-message valid-message";
            error.style.display = "block";
            input.classList.remove("input-error");
            input.classList.add("input-valid");
        } else {
            error.textContent = "Ingrese un teléfono válido (ej: +56 9 1234 5678)";
            error.className = "error-message invalid-message";
            error.style.display = "block";
            input.classList.remove("input-valid");
            input.classList.add("input-error");
        }
    });

    input.addEventListener("blur", function () {
        if (!this.value.trim()) {
            error.style.display = "none";
            input.classList.remove("input-error", "input-valid");
        }
    });
}

activarValidacionTelefono("telefono", "errorTelefono");
activarValidacionTelefono("telefonoUsuario", "errorTelefonoUsuario");

// Animar inputs requeridos si quedan vacíos (shake) al perder foco
(function attachRequiredInputHandlers(){
    const requiredInputs = Array.from(document.querySelectorAll('#registroForm [required]'));
    requiredInputs.forEach(input => {
        // Solo marcar error al salir del campo si está vacío
        input.addEventListener('blur', () => {
            const val = (input.value || '').toString().trim();
            if (!val) {
                input.classList.add('input-error');
                input.classList.add('input-shake');
                input.addEventListener('animationend', function onEnd(){
                    input.classList.remove('input-shake');
                    input.removeEventListener('animationend', onEnd);
                });
            } else {
                // Solo quitar el error, NUNCA agregar input-valid por blur
                input.classList.remove('input-error');
                input.classList.remove('input-valid');
            }
        });
    });
})();

    // Reiniciar formulario: limpiar inputs, checkboxes, firma y estado del botón global
    function resetForm() {
        const form = document.getElementById('registroForm');
        if (form) form.reset();

        // Limpiar checkboxes
        const inputs = Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));
        inputs.forEach(i => {
            i.checked = false;
            delete i.dataset.userChecked;
        });

        // Resetear contadores
        const ci = document.getElementById('countInstalacion');
        const cv = document.getElementById('countValidacion');
        if (ci) ci.textContent = '0 / 13';
        if (cv) cv.textContent = '0 / 4';

        // Limpiar observación explícitamente
        const obs = document.getElementById('observacionTecnico');
        if (obs) obs.value = '';

        // Limpiar firma
        if (window.clearSignature) window.clearSignature();
        const hiddenFirma = document.getElementById('firmaBase64');
        if (hiddenFirma) hiddenFirma.value = '';

        // Ocultar banner de firma confirmada
        const firmaConfirmada = document.getElementById('firmaConfirmada');
        if (firmaConfirmada) firmaConfirmada.classList.remove('show');

        // Reset texto y estado del botón global
        if (btnSelectAllGlobal) {
            btnSelectAllGlobal.disabled = true;
            const textEl = btnSelectAllGlobal.querySelector('.btn-text');
            if (textEl) textEl.textContent = 'Seleccionar todo';
            else btnSelectAllGlobal.textContent = 'Seleccionar todo';
        }

        // Limpiar TODAS las clases de estado en inputs (error Y valid)
        Array.from(document.querySelectorAll('#registroForm .input-error, #registroForm .input-valid'))
            .forEach(el => el.classList.remove('input-error', 'input-valid'));

        // Ocultar mensajes de RUT, email y teléfono
        ['errorRutUsuario', 'errorRutTecnico', 'errorEmailUsuario', 'errorCorreoUsuario', 'errorTelefono', 'errorTelefonoUsuario'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.textContent = ''; }
        });
    }

 window.generarPDF = async function () {

    let firma = document.getElementById("firmaBase64").value;
    if (!firma) {
        if (typeof hasSignature !== 'undefined' && hasSignature) {
            firma = canvas.toDataURL("image/png");
            document.getElementById("firmaBase64").value = firma;
        } else {
            alert("Debe confirmar la firma antes de generar el PDF");
            return;
        }
    }

    const numeroActa = "ACTA-" + Date.now();

    const data = {
        numeroActa,
        fecha: new Date().toLocaleDateString(),
        organismo: document.getElementById("organismo").value,
        establecimiento: document.getElementById("establecimiento").value,
        region: document.getElementById("region").value,
        ciudad: document.getElementById("ciudad").value,
        nombreUsuario: document.getElementById("nombreUsuario").value,
        cargoUsuario: (document.getElementById("cargoUsuarioFirma") || document.getElementById("cargoUsuario")).value,
        firma,
        instalacionChecks: Array.from(document.querySelectorAll(".checklist.instalacion input")).map(i => i.checked),
        validacionChecks: Array.from(document.querySelectorAll(".checklist.validacion input")).map(i => i.checked),
        observacion: (document.getElementById("observacionTecnico") && document.getElementById("observacionTecnico").value) || ''
    };

    // Validar campos requeridos antes de generar PDF
    const required = Array.from(document.querySelectorAll('#registroForm [required]'));
    const empty = required.filter(i => !(i.value || '').toString().trim());
    if (empty.length) {
        empty.forEach(i => {
            i.classList.add('input-error');
            i.classList.add('input-shake');
            i.addEventListener('animationend', function onEnd(){ i.classList.remove('input-shake'); i.removeEventListener('animationend', onEnd); });
        });
        empty[0].focus();
        return;
    }

    const contenido = generarContenidoActa(data);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contenido;
    tempDiv.style.width = "210mm"; // ancho A4
    tempDiv.style.background = "white";
    tempDiv.style.padding = "20px";
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "10px";
    tempDiv.style.left = "-10000px"; // fuera de la vista pero renderable
    tempDiv.style.zIndex = "9999";
    tempDiv.style.opacity = "1";
    tempDiv.style.visibility = "visible";

    console.log('Generando PDF: contenido length', tempDiv.innerHTML.length);

    document.body.appendChild(tempDiv);

    // Mostrar overlay de carga para el usuario
    const overlay = document.createElement('div');
    overlay.id = 'pdfOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.innerHTML = '<div style="background:#fff;padding:16px 24px;border-radius:8px;font-family:Arial">Generando PDF, por favor espere...</div>';
    document.body.appendChild(overlay);

    await new Promise(resolve => setTimeout(resolve, 1200));
    try {
        console.log('Usando html2canvas para render');
        const canvasRender = await (window.html2canvas ? window.html2canvas(tempDiv, {scale: 2, backgroundColor: '#ffffff', useCORS: true}) : html2canvas(tempDiv, {scale: 2, backgroundColor: '#ffffff', useCORS: true}));
        const imgData = canvasRender.toDataURL('image/png');

        const JsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);

        if (!JsPDFConstructor) throw new Error('jsPDF no disponible');

        const pdf = new JsPDFConstructor({ unit: 'mm', format: 'a4', orientation: 'portrait' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvasRender.height * pdfWidth) / canvasRender.width;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Si la imagen resulta más alta que la página, escalarla para que quepa en una sola hoja
        if (pdfHeight > pageHeight) {
            const scale = pageHeight / pdfHeight;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth * scale, pdfHeight * scale);
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        pdf.save(numeroActa + '.pdf');
        // ...existing code...
        // Reiniciar formulario tras descarga
        try { resetForm(); } catch(e){ console.warn('No se pudo reiniciar el formulario tras pdf.save', e); }

    } catch (err) {
        console.error('Error creando PDF manualmente:', err);
        await html2pdf().set({
            margin: 10,
            filename: numeroActa + ".pdf",
            html2canvas: { scale: 2, backgroundColor: "#ffffff" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        }).from(tempDiv).save();
        // ...existing code...
        // Reiniciar formulario tras fallback
        try { resetForm(); } catch(e){ console.warn('No se pudo reiniciar el formulario tras html2pdf save', e); }
    } finally {
        try { if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv); } catch(e){}
        try { if (document.body.contains(overlay)) document.body.removeChild(overlay); } catch(e){}
    }
};

// ==============================
// CHECKLIST COUNTERS
// ==============================

function updateCounter(groupClass, counterId, total) {
    const el = document.getElementById(counterId);
    if (!el) return;
    const checked = document.querySelectorAll(`.checklist.${groupClass} input:checked`).length;
    el.textContent = `${checked} / ${total}`;
}

document.querySelectorAll('.checklist.instalacion input').forEach(cb => {
    cb.addEventListener('change', () => updateCounter('instalacion', 'countInstalacion', 13));
});
document.querySelectorAll('.checklist.validacion input').forEach(cb => {
    cb.addEventListener('change', () => updateCounter('validacion', 'countValidacion', 4));
});

// ==============================
// FIRMA DIGITAL RESPONSIVE
// ==============================

const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");

let drawing = false;
let hasSignature = false;

function applyCtxStyles() {
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e2d3d";
}

function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    applyCtxStyles();
}

window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(() => requestAnimationFrame(resizeCanvas));

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
    const scaleY = canvas.height / rect.height / (window.devicePixelRatio || 1);
    if (event.touches) {
        return {
            x: (event.touches[0].clientX - rect.left) * scaleX,
            y: (event.touches[0].clientY - rect.top) * scaleY
        };
    }
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

function startDraw(e) {
    e.preventDefault();
    drawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    const ph = document.getElementById('firmaPlaceholder');
    if (ph) ph.style.opacity = '0';
}
function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasSignature = true;
}
function endDraw() { drawing = false; }

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseleave", endDraw);
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", endDraw);

// Limpiar
window.clearSignature = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("firmaBase64").value = "";
    const ph = document.getElementById('firmaPlaceholder');
    if (ph) ph.style.opacity = '1';
    const confirmed = document.getElementById('firmaConfirmada');
    if (confirmed) confirmed.classList.remove('show');
    hasSignature = false;
};

// Confirmar
window.saveSignature = function () {
    if (!hasSignature) {
        alert("Debe realizar la firma antes de confirmarla");
        return;
    }
    const dataURL = canvas.toDataURL("image/png");
    document.getElementById("firmaBase64").value = dataURL;
    const confirmed = document.getElementById('firmaConfirmada');
    if (confirmed) confirmed.classList.add('show');
    else alert("Firma confirmada correctamente ✔");
};
});