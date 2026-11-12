# Menú digital — Los mejores callos de Tepic

Contexto para continuar este proyecto en Claude Code. Viene de una conversación previa en claude.ai donde se definió el enfoque; aquí está todo lo decidido y lo que falta.

## El proyecto

Menú digital estático para un restaurante de mariscos en Tepic, Nayarit. Los clientes lo abren escaneando un QR en la mesa. El desarrollador es Jorge (freelance), que ya ha trabajado con Firebase.

## El cliente

- **Nombre:** Los mejores callos de Tepic
- **Instagram:** @losmejorescallos_tepic
- **Especialidad:** callo de hacha y mariscos frescos (callo con cebolla morada, pepino, limón, camarón)
- **Horario:** miércoles a lunes, 11:00 a.m. – 4:00 p.m. **Martes cerrado.**
- **Dirección (bio de Instagram):** Privada Tepame, Tepic, Nayarit 63136
- **Google Maps:** el link del perfil apunta a "C. Tepame 40, El Tecolote, 63135". El código postal no coincide con el de la bio → **confirmar dirección exacta y link con el dueño.**
- **Envíos a domicilio:** por Mandadito (en algunos posts parece mencionar también DiDi → confirmar).

## Decisiones técnicas

- **Hosting:** Firebase Hosting, plan Spark (gratuito, sin tarjeta). Límites: 10 GB de almacenamiento y **360 MB/día de transferencia**. Si se rebasa, el sitio deja de responder hasta que se renueva la cuota (no hay cobros).
- **Sitio 100% estático:** HTML + CSS + JS vanilla. Sin framework, sin backend, sin build step obligatorio.
- **Datos del menú en `public/data/menu.json`**, renderizados con JS. Cambiar un precio = editar una línea del JSON y hacer `firebase deploy`.
- **Imágenes dentro del deploy de Hosting**, NO en Cloud Storage (desde febrero de 2026, Cloud Storage para Firebase exige cuenta de facturación incluso en el nivel gratuito).
- **QR estático** que codifica la URL directamente (p. ej. `https://<proyecto>.web.app`). Nada de servicios de "QR dinámico" que redirigen por sus servidores: muchos caducan y dejan inservibles los QR impresos. Generarlo localmente (librería `qrcode` de npm o Python) en PNG y SVG para imprenta.
- La URL no cambia entre deploys, así que el menú se puede actualizar sin reimprimir QR.

## Presupuesto de peso (importante por el límite de 360 MB/día)

- Primera carga total objetivo: **≤ 500 KB** (≈ 700+ visitas/día dentro de la cuota).
- Fotos en **WebP**, ~50–100 KB cada una, ancho máx. ~800 px. Usar `loading="lazy"` y `width`/`height` explícitos.
- En `firebase.json`, headers de caché: imágenes, CSS y JS con caché larga (p. ej. `max-age=31536000` usando nombres de archivo versionados) y `menu.json` con caché corta (p. ej. `max-age=300`) para que los cambios de precio se vean pronto.
- Íconos en SVG inline (picante, nuevo, recomendado, etc.).

## Dirección de diseño

Su Instagram no tiene identidad unificada: no hay logo (la foto de perfil es un plato) y cada post tiene un estilo distinto. Lo constante es el tono: colores fuertes, letras gruesas y llamativas, comida fresca en primer plano. El menú debe tomar ese tono y ordenarlo.

- **Paleta sacada del propio platillo** (valores de partida, ajustables):
  - Fondo crema `#FFF8EC`
  - Morado cebolla `#8E3A7E`
  - Verde limón `#7DB33A` / pepino `#A8C66C`
  - Acentos de sus posts: rojo `#D7261E` y amarillo `#FFC928` (precios, botones)
  - Texto oscuro `#2A1F1A`
- **Tipografía:** gruesa y condensada para títulos (p. ej. Anton o Bebas Neue, en la línea de su post "CALLO DE HACHA") y una sans legible para descripciones (p. ej. Inter o Nunito Sans). Considerar autoalojar las fuentes en `public/fonts/` para no depender de terceros y controlar el peso.
- **Mobile-first:** casi todo el tráfico llega por QR desde el celular. Botones grandes, buen contraste, legible en exterior.
- `lang="es-MX"`, precios en MXN con formato `$120`.
- **Fotos:** usar fotos reales del dueño, originales y **sin texto encima** (las del feed casi todas tienen letreros). No usar imágenes generadas con IA para los platillos. Si aún no hay fotos, el diseño debe verse completo sin ellas.
- No usar imágenes de futbolistas, escudos de la selección ni banderas que aparecen en sus posts del Mundial.

## Funcionalidades

1. **Menú por categorías** (definir con el dueño), con navegación rápida entre secciones (barra fija o chips).
2. **Indicador "Abierto ahora / Cerrado"** según el horario. Calcularlo con la zona horaria `America/Mazatlan` (Tepic) usando `Intl.DateTimeFormat`, no con la hora local del dispositivo. Martes = cerrado todo el día.
3. **Botones de contacto:** Google Maps, Instagram, pedir a domicilio (Mandadito) y WhatsApp directo (`https://wa.me/52XXXXXXXXXX`) si lo usan.
4. **Horario y dirección** visibles en el pie de la página.

## Estructura sugerida

```
/
├── firebase.json
├── .firebaserc
├── public/              ← lo único que se despliega
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   ├── data/menu.json
│   ├── img/             ← WebP optimizados
│   └── fonts/
├── fotos-originales/    ← fotos sin procesar del dueño (no se despliegan)
└── qr/                  ← QR en PNG/SVG para imprimir (no se despliega)
```

Esquema de partida para `menu.json` (ajustar cuando lleguen los datos reales):

```json
{
  "categorias": [
    {
      "id": "callos",
      "nombre": "Callos",
      "platillos": [
        {
          "nombre": "Callo de hacha",
          "descripcion": "Con cebolla morada, pepino y limón",
          "precios": [
            { "tamano": "Orden", "precio": 0 },
            { "tamano": "Media orden", "precio": 0 }
          ],
          "foto": "img/callo-de-hacha.webp",
          "etiquetas": ["recomendado"],
          "disponible": true
        }
      ]
    }
  ]
}
```

## Pendientes (información que falta del dueño)

- [ ] Lista de platillos con precios y tamaños (orden, media orden, litro, etc.)
- [ ] Bebidas
- [ ] Número de WhatsApp para pedidos (si lo usan)
- [ ] Fotos originales de los platillos, sin texto
- [ ] Confirmar dirección exacta y link de Google Maps
- [ ] Confirmar plataformas de envío (Mandadito, ¿DiDi?)
- [ ] Nombre del proyecto en Firebase / URL final (`.web.app` o dominio propio)

## Siguiente paso

Mientras llega la información real, armar un **primer borrador con platillos de ejemplo** para enseñárselo al dueño y validar el estilo.
