// ================= FORMATO ACTA PDF =================

function generarContenidoActa(data) {

    const check = (valor) => valor ? "✔" : "✗";

    return `
    <style>
      .acta-body { font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#111; }
      .acta-body h2{ font-size:16px; margin:6px 0; }
      .acta-body h3{ font-size:14px; margin:10px 0; }
      .acta-body table{ font-size:11px; }
      .acta-body table td, .acta-body table th{ padding:6px 8px; }
    .acta-observation{ border:1px solid #ddd; padding:8px; border-radius:6px; white-space:pre-wrap; font-size:11px; line-height:1.2; }
    .acta-signature img{ width:150px; }
    .check { text-align:center; font-weight:bold; width:48px; }
    </style>

    <div class="acta-body" style="text-align:center;">
        <h2>MINISTERIO DE SALUD</h2>
        <h3>ACTA DE CAMBIO DE EQUIPO</h3>
    </div>

    <br>

    <table style="width:100%; border-collapse:collapse;" border="1">
    <tr>
        <td><strong>N° Acta</strong></td>
        <td>${data.numeroActa}</td>
        <td><strong>Fecha</strong></td>
        <td>${data.fecha}</td>
    </tr>
    <tr>
        <td><strong>Organismo</strong></td>
        <td colspan="3">${data.organismo}</td>
    </tr>
    <tr>
        <td><strong>Establecimiento</strong></td>
        <td colspan="3">${data.establecimiento}</td>
    </tr>
    <tr>
        <td><strong>Región</strong></td>
        <td>${data.region}</td>
        <td><strong>Comuna</strong></td>
        <td>${data.ciudad}</td>
    </tr>
    </table>

    <br><br>

    <h3>Checklist Instalación</h3>

    <table style="width:100%; border-collapse:collapse;" border="1">
    <tr><th>Acción</th><th>Check</th></tr>
    <tr><td>Desembalaje, revisión e instalación física del equipo</td><td>${check(data.instalacionChecks[0])}</td></tr>
    <tr><td>Instalación de PC y conexión de componentes básicos (mouse, teclado y torre)</td><td>${check(data.instalacionChecks[1])}</td></tr>
    <tr><td>Verificación de conexión adecuada a la toma de corriente</td><td>${check(data.instalacionChecks[2])}</td></tr>
    <tr><td>Instalación y configuración de periféricos adicionales (escáner, impresora, fax, etc.)</td><td>${check(data.instalacionChecks[3])}</td></tr>
    <tr><td>Configuración y conexión a red de datos</td><td>${check(data.instalacionChecks[4])}</td></tr>
    <tr><td>Configuración IP Equipo</td><td>${check(data.instalacionChecks[5])}</td></tr>
    <tr><td>Instalación y personalización de aplicaciones desde el servidor de red</td><td>${check(data.instalacionChecks[6])}</td></tr>
    <tr><td>Definición y configuración del servicio de impresión</td><td>${check(data.instalacionChecks[7])}</td></tr>
    <tr><td>Migración de información del usuario desde su equipo antiguo</td><td>${check(data.instalacionChecks[8])}</td></tr>
    <tr><td>Conexión final del equipo a la red</td><td>${check(data.instalacionChecks[9])}</td></tr>
    <tr><td>Verificación de agente en línea con mesa de ayuda</td><td>${check(data.instalacionChecks[10])}</td></tr>
    <tr><td>Configuración de correo electrónico del usuario</td><td>${check(data.instalacionChecks[11])}</td></tr>
    <tr><td>Configuración de pie de firma en correo</td><td>${check(data.instalacionChecks[12])}</td></tr>
    </table>

    <br><br>

    <h3>Checklist Validación</h3>

    <table style="width:100%; border-collapse:collapse;" border="1">
    <tr><th>Acción</th><th>Check</th></tr>
    <tr><td>Número de serie del equipo</td><td>${check(data.validacionChecks[0])}</td></tr>
    <tr><td>N° Guía de despacho</td><td>${check(data.validacionChecks[1])}</td></tr>
    <tr><td>Revisión del sistema operativo y software instalados</td><td>${check(data.validacionChecks[2])}</td></tr>
    <tr><td>Entrega formal del equipo con formulario de ingreso</td><td>${check(data.validacionChecks[3])}</td></tr>
    </table>

    <br><br>

    <h3>Observación Técnico</h3>
    <div class="acta-observation">
        ${data.observacion ? data.observacion : '—'}
    </div>

    <br><br>

    <h3>Datos Usuario</h3>

    <table style="width:100%; border-collapse:collapse;" border="1">
    <tr><td><strong>Nombre</strong></td><td>${data.nombreUsuario}</td></tr>
    <tr><td><strong>Cargo</strong></td><td>${data.cargoUsuario}</td></tr>
    <tr>
        <td><strong>Firma</strong></td>
        <td class="acta-signature"><img src="${data.firma}" alt="firma"></td>
    </tr>
    </table>
    `;
}