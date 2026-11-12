(() => {
  'use strict';

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DIA_CORTO = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  const ICONOS = {
    recomendado: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>',
    nuevo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
    picante: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 3c0 1.5-1 2.5-2 3 3 0 6 2 6 6 0 5-5 9-11 9-2 0-3-1-3-2 3 0 6-3 6-8 0-2 1-4 3-5 0-1 .5-2 1-3z"/></svg>',
    agotado: ''
  };
  const ETIQUETA_TEXTO = { recomendado: 'Recomendado', nuevo: 'Nuevo', picante: 'Picante', agotado: 'Agotado' };

  const ICONO_BOTON = {
    maps: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>',
    mandadito: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h11v9H3zm11 3h4l3 3v3h-7zM6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>'
  };

  const ICONO_NOTA = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="16" r="9" fill="#A8C66C" stroke="#5E8F2A" stroke-width="2"/><circle cx="11" cy="16" r="5" fill="#D6E6A8"/><circle cx="23" cy="16" r="7.5" fill="none" stroke="#8E3A7E" stroke-width="2.5"/><circle cx="23" cy="16" r="4" fill="none" stroke="#C77BB6" stroke-width="2"/></svg>';

  /** Crea un elemento. `hijos` puede ser texto, nodos o arreglos. */
  function h(tag, attrs = {}, ...hijos) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    for (const hijo of hijos.flat()) {
      if (hijo == null || hijo === false) continue;
      el.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    }
    return el;
  }

  const formatoPrecio = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
  const precioTexto = (p) => (typeof p === 'number' && p > 0 ? '$' + formatoPrecio.format(p) : '$ —');

  /* ---------------- Menú ---------------- */

  function renderPlatillo(p) {
    const etiquetas = [...(p.etiquetas || [])];
    const disponible = p.disponible !== false;
    if (!disponible) etiquetas.push('agotado');

    return h('article', { class: 'platillo' + (disponible ? '' : ' agotado') },
      p.foto && h('img', {
        class: 'platillo-foto', src: p.foto, alt: p.nombre,
        width: 800, height: 600, loading: 'lazy', decoding: 'async'
      }),
      etiquetas.length > 0 && h('div', { class: 'etiquetas' },
        etiquetas.map((e) => h('span', { class: 'etiqueta etiqueta-' + e, html: (ICONOS[e] || '') }, ETIQUETA_TEXTO[e] || e))
      ),
      h('h3', { class: 'platillo-nombre' }, p.nombre),
      p.descripcion && h('p', { class: 'platillo-desc' }, p.descripcion),
      h('ul', { class: 'precios' },
        (p.precios || []).map((pr) => h('li', {},
          h('span', { class: 'precio-tamano' }, pr.tamano),
          h('span', { class: 'precio-linea', 'aria-hidden': 'true' }),
          h('span', { class: 'precio-valor' + (pr.precio > 0 ? '' : ' pendiente') }, precioTexto(pr.precio))
        ))
      )
    );
  }

  function renderMenu(datos) {
    const main = document.getElementById('menu');
    const chips = document.getElementById('chips');
    main.replaceChildren();
    chips.replaceChildren();

    const neg = datos.negocio || {};
    if (neg.nota) main.append(h('p', { class: 'nota', html: ICONO_NOTA }, neg.nota));

    for (const cat of datos.categorias || []) {
      const idTitulo = 'titulo-' + cat.id;
      main.append(
        h('section', { class: 'categoria', id: cat.id, 'aria-labelledby': idTitulo },
          h('h2', { class: 'seccion-titulo', id: idTitulo }, cat.nombre),
          h('div', { class: 'platillos' }, (cat.platillos || []).map(renderPlatillo))
        )
      );
      chips.append(h('a', { class: 'chip', href: '#' + cat.id }, cat.nombre));
    }

    activarChips();
  }

  function activarChips() {
    const chips = document.getElementById('chips');
    const enlaces = [...chips.querySelectorAll('.chip')];
    const secciones = enlaces.map((a) => document.querySelector(a.getAttribute('href')));
    if (!('IntersectionObserver' in window) || secciones.length === 0) return;

    const marcar = (id) => {
      for (const a of enlaces) {
        const activo = a.getAttribute('href') === '#' + id;
        a.setAttribute('aria-current', activo ? 'true' : 'false');
        if (activo) {
          // Solo desplazar la barra de chips en horizontal; scrollIntoView
          // también movía la página y regresaba el scroll hacia arriba.
          const izq = a.offsetLeft - chips.offsetLeft;
          const fueraIzq = izq < chips.scrollLeft;
          const fueraDer = izq + a.offsetWidth > chips.scrollLeft + chips.clientWidth;
          if (fueraIzq || fueraDer) chips.scrollTo({ left: izq - 16, behavior: 'smooth' });
        }
      }
    };

    const visibles = new Map();
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) visibles.set(e.target.id, e.isIntersecting);
      const primera = secciones.find((s) => visibles.get(s.id));
      if (primera) marcar(primera.id);
    }, { rootMargin: '-80px 0px -55% 0px' });
    secciones.forEach((s) => obs.observe(s));

    // Borde inferior cuando la barra ya está pegada arriba
    const centinela = document.querySelector('.cinta');
    if (centinela) {
      new IntersectionObserver(([e]) => chips.classList.toggle('pegada', !e.isIntersecting))
        .observe(centinela);
    }
  }

  /* ---------------- Contacto y pie ---------------- */

  function renderContacto(neg) {
    const c = neg.contacto || {};
    const botones = document.getElementById('botones');
    const lista = [
      c.whatsapp && { tipo: 'whatsapp', texto: 'Pedir por WhatsApp', url: 'https://wa.me/' + c.whatsapp.replace(/\D/g, '') },
      c.mandadito && { tipo: 'mandadito', texto: 'Pedir a domicilio', url: c.mandadito },
      c.maps && { tipo: 'maps', texto: 'Ver en Google Maps', url: c.maps },
      c.instagram && { tipo: 'instagram', texto: c.instagramUsuario || 'Instagram', url: c.instagram }
    ].filter(Boolean);

    botones.replaceChildren(...lista.map((b) =>
      h('a', {
        class: 'boton boton-' + b.tipo, href: b.url,
        target: '_blank', rel: 'noopener', html: ICONO_BOTON[b.tipo]
      }, b.texto)
    ));

    const hor = neg.horario || {};
    const pieHorario = document.getElementById('pie-horario');
    if (hor.texto) pieHorario.replaceChildren(hor.texto, h('br'), h('strong', {}, hor.textoCerrado || ''));
    if (neg.direccion) document.getElementById('pie-direccion').textContent = neg.direccion;
    if (c.envios) document.getElementById('pie').append(h('p', { class: 'pie-envios' }, c.envios));
    if (neg.lema) document.getElementById('lema').textContent = neg.lema;
  }

  /* ---------------- Abierto / cerrado ---------------- */

  const aMinutos = (hhmm) => { const [a, b] = hhmm.split(':').map(Number); return a * 60 + b; };

  function horaLegible(min) {
    const hh = Math.floor(min / 60), mm = min % 60;
    const h12 = ((hh + 11) % 12) + 1;
    return h12 + ':' + String(mm).padStart(2, '0') + (hh < 12 ? ' a.m.' : ' p.m.');
  }

  /** Día de la semana (0 = domingo) y minutos desde medianoche en la zona del negocio. */
  function ahoraEn(zona) {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: zona, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const get = (t) => partes.find((p) => p.type === t).value;
    return { dia: DIA_CORTO[get('weekday')], min: Number(get('hour')) * 60 + Number(get('minute')) };
  }

  function calcularEstado(hor) {
    const abiertos = new Set(hor.diasAbiertos);
    const ap = aMinutos(hor.apertura), ci = aMinutos(hor.cierre);
    const { dia, min } = ahoraEn(hor.zonaHoraria || 'America/Mazatlan');

    if (abiertos.has(dia) && min >= ap && min < ci) {
      return { abierto: true, texto: 'Abierto ahora · cierra a las ' + horaLegible(ci) };
    }
    if (abiertos.has(dia) && min < ap) {
      return { abierto: false, texto: 'Cerrado · abre hoy a las ' + horaLegible(ap) };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (abiertos.has(d)) {
        const cuando = i === 1 ? 'mañana' : 'el ' + DIAS[d];
        return { abierto: false, texto: 'Cerrado · abre ' + cuando + ' a las ' + horaLegible(ap) };
      }
    }
    return { abierto: false, texto: 'Cerrado' };
  }

  function pintarEstado(hor) {
    const el = document.getElementById('estado');
    try {
      const est = calcularEstado(hor);
      el.classList.toggle('abierto', est.abierto);
      el.classList.toggle('cerrado', !est.abierto);
      el.querySelector('.estado-texto').textContent = est.texto;
    } catch (err) {
      el.hidden = true;
    }
  }

  /* ---------------- Arranque ---------------- */

  fetch('data/menu.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((datos) => {
      const neg = datos.negocio || {};
      renderMenu(datos);
      renderContacto(neg);
      if (neg.horario) {
        pintarEstado(neg.horario);
        setInterval(() => pintarEstado(neg.horario), 60 * 1000);
      }
    })
    .catch(() => {
      document.getElementById('menu').replaceChildren(
        h('p', { class: 'cargando' }, 'No se pudo cargar el menú. Revisa tu conexión e intenta de nuevo.')
      );
    });
})();
