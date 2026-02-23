// ================= FORMATO ACTA PDF =================

function generarContenidoActa(data) {

    const chk = (valor) => valor
        ? `<span class="chk-si">SI</span>`
        : `<span class="chk-no">NO</span>`;

    const val = (v) => (v && String(v).trim()) ? v : '—';

    return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .acta-body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111; line-height: 1.4; background: white; }
      .acta-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 10px; }
      .acta-logo-block { font-size: 11px; color: #444; line-height: 1.6; }
      .acta-logo-block .logo-icon { font-size: 28px; display: block; margin-bottom: 2px; }
      .acta-title-block { text-align: center; flex: 1; padding: 0 20px; }
      .acta-title-block h1 { font-size: 16px; font-weight: bold; color: #111; margin-bottom: 4px; }
      .acta-title-block .acta-numero { font-size: 11px; color: #555; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 11px; }
      table td, table th { padding: 4px 7px; border: 1px solid #ccc; vertical-align: top; }
      table th { background: #f0f0f0; font-weight: bold; font-size: 11px; }
      .section-header td { background: #e8e8e8; font-weight: bold; font-size: 11px; padding: 4px 7px; }
      .lc { color: #333; width: 18%; white-space: nowrap; }
      .checklist-grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 0; }
      .checklist-col { display: table-cell; width: 50%; vertical-align: top; border: 1px solid #ccc; }
      .checklist-col:first-child { border-right: none; }
      .checklist-col table { border: none; }
      .checklist-col table td { border-left: none; border-right: none; }
      .checklist-col table tr:last-child td { border-bottom: none; }
      .checklist-col table tr:first-child td { border-top: none; }
      .chk { text-align: center; width: 36px; font-weight: bold; white-space: nowrap; }
      .chk-si { color: #111; }
      .chk-no { color: #aaa; }
      .firma-area { height: 80px; padding: 4px 7px; vertical-align: middle; }
      .firma-area img { max-width: 180px; max-height: 70px; }
      .acta-footer { text-align: center; font-size: 10px; color: #888; margin-top: 16px; padding-top: 8px; border-top: 1px solid #ccc; }
      .obs-box { border: 1px solid #ccc; padding: 6px 8px; min-height: 32px; white-space: pre-wrap; font-size: 11px; background: #fafafa; }
      .spacer { height: 10px; }
    </style>

    <div class="acta-body">

      <!-- CABECERA SUPERIOR -->
      <div class="acta-top">
        <div class="acta-logo-block">
          <span class="logo-icon">🏥</span>
          MINISTERIO DE SALUD<br>
          Proyecto MINSAL 2026<br>
          Chile
        </div>
        <div class="acta-title-block">
          <h1>Acta de Cambio de Equipo</h1>
          <div class="acta-numero">${val(data.numeroActa)}</div>
        </div>
        <div style="width:120px"></div>
      </div>

      <!-- DATOS GENERALES -->
      <table>
        <tr class="section-header"><td colspan="4"><strong>Datos Generales</strong></td></tr>
        <tr>
          <td class="lc">Organismo</td>
          <td colspan="3"><strong>${val(data.organismo)}</strong></td>
        </tr>
        <tr>
          <td class="lc">Establecimiento</td>
          <td>${val(data.establecimiento)}</td>
          <td class="lc">Fecha</td>
          <td>${val(data.fecha)}</td>
        </tr>
        <tr>
          <td class="lc">Dirección</td>
          <td>${val(data.direccion)}</td>
          <td class="lc">Ciudad</td>
          <td>${val(data.ciudad)}</td>
        </tr>
        <tr>
          <td class="lc">Unidad o Depto</td>
          <td>${val(data.unidad)}</td>
          <td class="lc">Región</td>
          <td>${val(data.region)}</td>
        </tr>
        <tr>
          <td class="lc">Responsable</td>
          <td>${val(data.responsable)}</td>
          <td class="lc">RUT</td>
          <td>${val(data.rutUsuario)}</td>
        </tr>
        <tr>
          <td class="lc">Email Usuario</td>
          <td>${val(data.emailUsuario)}</td>
          <td class="lc">Teléfono</td>
          <td>${val(data.telefono)}</td>
        </tr>
        <tr>
          <td class="lc">Cargo Usuario</td>
          <td>${val(data.cargoUsuario)}</td>
          <td class="lc">Serie computador</td>
          <td>${val(data.serieRecambio)}</td>
        </tr>
        <tr>
          <td class="lc">Serie saliente</td>
          <td colspan="3">${val(data.serieSaliente)}</td>
        </tr>
      </table>

      <div class="spacer"></div>

      <!-- CHECKLISTS LADO A LADO -->
      <div class="checklist-grid">

        <!-- Instalación (izquierda) -->
        <div class="checklist-col">
          <table>
            <tr class="section-header"><td><strong>Checklist Instalación</strong></td><td class="chk"></td></tr>
            <tr><td>Desembalaje, revisión e instalación física del equipo</td><td class="chk">${chk(data.instalacionChecks[0])}</td></tr>
            <tr><td>Instalación de PC y conexión de componentes básicos (mouse, teclado y torre)</td><td class="chk">${chk(data.instalacionChecks[1])}</td></tr>
            <tr><td>Verificación de conexión adecuada a la toma de corriente</td><td class="chk">${chk(data.instalacionChecks[2])}</td></tr>
            <tr><td>Instalación y configuración de periféricos adicionales (escáner, impresora, fax, etc.)</td><td class="chk">${chk(data.instalacionChecks[3])}</td></tr>
            <tr><td>Configuración y conexión a red de datos</td><td class="chk">${chk(data.instalacionChecks[4])}</td></tr>
            <tr><td>Configuración IP Equipo</td><td class="chk">${chk(data.instalacionChecks[5])}</td></tr>
            <tr><td>Instalación y personalización de aplicaciones desde el servidor de red</td><td class="chk">${chk(data.instalacionChecks[6])}</td></tr>
            <tr><td>Definición y configuración del servicio de impresión</td><td class="chk">${chk(data.instalacionChecks[7])}</td></tr>
            <tr><td>Migración de información del usuario desde su equipo antiguo</td><td class="chk">${chk(data.instalacionChecks[8])}</td></tr>
            <tr><td>Conexión final del equipo a la red</td><td class="chk">${chk(data.instalacionChecks[9])}</td></tr>
            <tr><td>Verificación de agente en línea con mesa de ayuda</td><td class="chk">${chk(data.instalacionChecks[10])}</td></tr>
            <tr><td>Configuración de correo electrónico del usuario</td><td class="chk">${chk(data.instalacionChecks[11])}</td></tr>
            <tr><td>Configuración de pie de firma en correo</td><td class="chk">${chk(data.instalacionChecks[12])}</td></tr>
          </table>
        </div>

        <!-- Validación (derecha) -->
        <div class="checklist-col">
          <table>
            <tr class="section-header"><td><strong>Checklist Validación</strong></td><td class="chk"></td></tr>
            <tr><td>Número de serie del equipo</td><td class="chk">${chk(data.validacionChecks[0])}</td></tr>
            <tr><td>N° Guía de despacho</td><td class="chk">${chk(data.validacionChecks[1])}</td></tr>
            <tr><td>Revisión del sistema operativo y software instalados</td><td class="chk">${chk(data.validacionChecks[2])}</td></tr>
            <tr><td>Entrega formal del equipo con formulario de ingreso</td><td class="chk">${chk(data.validacionChecks[3])}</td></tr>
          </table>
        </div>

      </div><!-- /checklist-grid -->

      <div class="spacer"></div>

      <!-- OBSERVACIONES -->
      <table>
        <tr class="section-header"><td><strong>Observaciones Técnico</strong></td></tr>
        <tr><td><div class="obs-box">${data.observacion ? data.observacion : '—'}</div></td></tr>
      </table>

      <div class="spacer"></div>

      <!-- ACEPTACIÓN CONFORME -->
      <table>
        <tr class="section-header"><td colspan="4"><strong>Aceptación Conforme</strong></td></tr>
        <tr>
          <td class="lc">Técnico Instalador</td>
          <td>${val(data.tecnico)}</td>
          <td class="lc">RUT Técnico</td>
          <td>${val(data.rutTecnico)}</td>
        </tr>
      </table>

      <div class="spacer"></div>

      <!-- RESPONSABLE MINSAL - ancho completo -->
      <table>
        <tr class="section-header"><td colspan="4"><strong>Responsable MINSAL</strong></td></tr>
        <tr>
          <td class="lc">Nombre</td><td>${val(data.nombreUsuario)}</td>
          <td class="lc">RUT</td><td>${val(data.rutUsuario)}</td>
        </tr>
        <tr>
          <td class="lc">Cargo</td><td>${val(data.cargoUsuarioFirma)}</td>
          <td class="lc">Unidad / Depto.</td><td>${val(data.unidadUsuario)}</td>
        </tr>
        <tr>
          <td class="lc">Correo</td><td>${val(data.correoUsuario)}</td>
          <td class="lc">Teléfono</td><td>${val(data.telefonoUsuario)}</td>
        </tr>
        <tr>
          <td class="lc">Firma Digital</td>
          <td colspan="3" class="firma-area"><img src="${data.firma}" alt="firma"></td>
        </tr>
      </table>

      <!-- PIE -->
      <div class="acta-footer">
        Ministerio de Salud — Chile &nbsp;|&nbsp; Proyecto MINSAL 2025 &nbsp;|&nbsp; Página: 1/1
      </div>

    </div><!-- /acta-body -->
    `;
}