# Score Energy Drink — Plataforma de Presentaciones Interactivas

Pitch deck interactivo de Score Energy Drink para la expansión a Brasil 2026.
Sitio 100% estático: HTML + CSS + JavaScript vanilla, con GSAP y Chart.js.

---

## 1. Estructura del proyecto

```
/
├── index.html                         → Landing principal con acceso a presentaciones
├── vercel.json                        → Configuración de deploy (Vercel)
├── README.md                          → Este archivo
│
├── brands/
│   └── score-brasil/
│       ├── index.html                 → Presentación completa Score Brasil 2026
│       ├── css/
│       │   └── theme.css              → Estilos específicos (colores, secciones)
│       ├── js/
│       │   └── main.js                → Animaciones GSAP, Chart.js, partículas
│       └── assets/                    → Carpeta para imágenes de latas y logo
│
├── shared/
│   ├── css/
│   │   └── base.css                   → Variables CSS, reset, estilos base y KPIs
│   └── js/
│       └── core.js                    → Contadores animados, barra de progreso, utilidades
│
└── data/
    └── score-brasil.json              → Datos del gráfico, KPIs, portafolio, contacto
```

---

## 2. Cómo editar el contenido

### Cambiar los datos del gráfico
Abre `/data/score-brasil.json` y edita la sección `grafico_crecimiento`:

```json
"grafico_crecimiento": {
  "labels": ["2012", ..., "2026"],
  "data":   [1, ..., 130]
}
```

El gráfico se actualiza automáticamente la próxima vez que alguien cargue la página.
> **Nota:** Los datos del JSON en esta versión se usan como referencia documental; los valores están también codificados directamente en `main.js` para el gráfico. Si actualizas el JSON, también actualiza el array `data` dentro de `buildChart()` en `main.js`.

### Cambiar los KPIs y textos
Abre `/brands/score-brasil/index.html` y busca las secciones con `data-counter`:

```html
<span data-counter="3.6" data-counter-decimals="1">3.6</span>
```

Cambia el valor del atributo `data-counter` y el texto interno para actualizar el número animado. El texto dentro de las cards (`.kpi-label`, `.kpi-desc`) se edita directamente en el HTML.

### Cambiar colores
Los colores del sitio están definidos como variables CSS en `/shared/css/base.css`:

```css
:root {
  --color-accent:     #FFD700;   /* Amarillo principal */
  --color-highlight:  #FF3B3B;   /* Rojo para datos impactantes */
  --color-bg:         #0A0A0A;   /* Fondo negro */
  --color-text:       #FFFFFF;   /* Texto principal */
  --color-text-muted: #888888;   /* Texto secundario */
}
```

Para personalizaciones específicas de Score Brasil, agrega overrides en `/brands/score-brasil/css/theme.css` dentro de `:root { }`.

### Agregar imágenes reales de las latas
1. Coloca los archivos PNG o WebP en `/brands/score-brasil/assets/`
   (recomendado: 400×600px, fondo transparente)
2. En `/brands/score-brasil/index.html`, busca los elementos `.lata-mockup` de cada producto
3. Reemplaza el bloque `<div class="lata-mockup__can">...</div>` por:

```html
<div class="lata-mockup" style="background: transparent; padding: 16px;">
  <img src="/brands/score-brasil/assets/gorilla.png"
       alt="Score Gorilla Guaraná"
       style="max-height: 100%; width: auto; object-fit: contain;" />
</div>
```

### Actualizar los datos de contacto del cierre
En `/brands/score-brasil/index.html`, busca la sección `<address class="cierre__contacto">` y reemplaza los placeholders:

```html
<span>[NOMBRE Y APELLIDO]</span>  →  <span>Juan Pérez</span>
<span>[CARGO]</span>               →  <span>Director Comercial Brasil</span>
<span>[EMAIL]</span>               →  <span>juan@scoreenergydrink.com</span>
<span>[TELÉFONO]</span>            →  <span>+56 9 XXXX XXXX</span>
```

---

## 3. Cómo hacer deploy en Vercel

### Opción A — Arrastrar carpeta (sin instalar nada, recomendado)
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita (o inicia sesión)
2. En el dashboard, haz clic en **"Add New Project"**
3. Selecciona la opción **"Deploy from your computer"** o arrastra directamente la carpeta del proyecto
4. Vercel detecta automáticamente que es un sitio estático
5. Haz clic en **"Deploy"**
6. En ~60 segundos tienes una URL pública del tipo `score-brasil-xxx.vercel.app`
7. Puedes configurar un dominio personalizado desde el panel de Vercel → Settings → Domains

### Opción B — Conectar repositorio GitHub
1. Sube la carpeta del proyecto a un repositorio en [github.com](https://github.com)
2. En Vercel, haz clic en **"Add New Project"** → **"Import Git Repository"**
3. Selecciona tu repo de GitHub
4. Vercel configurará el deploy automáticamente con cada `git push`
5. Recibirás una URL única por cada rama (ideal para revisar cambios antes de publicar)

> **Tip:** Con la opción GitHub, cada vez que actualices los datos del JSON o los textos y hagas commit, la presentación se actualiza automáticamente en la URL pública.

---

## 4. Cómo agregar una nueva presentación al sitio

La arquitectura está diseñada para escalar. Para agregar, por ejemplo, Score Perú:

**Paso 1 — Copiar la carpeta base:**
```
/brands/score-brasil/  →  /brands/score-peru/
```

**Paso 2 — Actualizar los archivos copiados:**
- `brands/score-peru/index.html`: Cambiar todos los textos, datos y referencias
- `brands/score-peru/css/theme.css`: Ajustar variables de color si la marca tiene identidad diferente
- `brands/score-peru/js/main.js`: Actualizar datos del gráfico y animaciones si corresponde

**Paso 3 — Crear el JSON de datos:**
```
/data/score-brasil.json  →  /data/score-peru.json
```
Actualiza los números de mercado, KPIs y portafolio con los datos de Perú.

**Paso 4 — Agregar la card en el índice:**
Abre `/index.html` y agrega un nuevo `<a class="pres-card">` dentro del grid `.presentations-grid`, siguiendo el mismo patrón que la card de Brasil.

**Paso 5 — Agregar el rewrite en Vercel:**
Abre `/vercel.json` y agrega:
```json
{ "source": "/brands/score-peru", "destination": "/brands/score-peru/index.html" }
```

---

## 5. Cómo ver el sitio en local (sin servidor)

### Opción rápida — Abrir el HTML directamente
1. Abre Chrome o Firefox
2. Arrastra el archivo `/brands/score-brasil/index.html` al navegador
3. La presentación abrirá con animaciones y estilos

> **Limitación:** Al abrir desde `file://`, el fetch del JSON (`score-brasil.json`) puede ser bloqueado por el navegador por seguridad. Los datos del gráfico están también en `main.js` directamente, por lo que el gráfico funcionará igual.

### Opción recomendada — Servidor local simple
Si tienes Python instalado:
```bash
# En la carpeta raíz del proyecto:
python3 -m http.server 3000
# Luego abre: http://localhost:3000
```

O con Node.js:
```bash
npx serve .
# Luego abre la URL que aparece en la terminal
```

---

## 6. Checklist antes de enviar

- [ ] Reemplazar todos los placeholders de contacto en la sección de cierre
  (`[NOMBRE Y APELLIDO]`, `[CARGO]`, `[EMAIL]`, `[TELÉFONO]`)
- [ ] Verificar que los datos del gráfico en `main.js` → `buildChart()` coincidan con la realidad
- [ ] Revisar todos los KPIs en el HTML (atributos `data-counter`)
- [ ] Agregar imágenes reales de latas en `/brands/score-brasil/assets/` si están disponibles
- [ ] Probar en celular antes de compartir el link (Chrome DevTools → Device Toolbar, o en un iPhone/Android real)
- [ ] Subir a Vercel y copiar la URL pública
- [ ] Verificar que la URL abra correctamente en modo incógnito (sin caché)

---

## Stack técnico

| Tecnología     | Uso                              | Versión CDN |
|---------------|----------------------------------|-------------|
| HTML5 + CSS3  | Estructura y estilos             | —           |
| JavaScript ES6| Lógica y animaciones             | —           |
| GSAP          | Animaciones scroll               | 3.12.5      |
| ScrollTrigger | Pin y scrub basado en scroll     | 3.12.5      |
| Chart.js      | Gráfico de crecimiento           | 4.4.4       |
| Google Fonts  | Bebas Neue + Inter               | —           |
| Vercel        | Deploy y hosting estático        | —           |

---

*Generado por Claude Cowork — Score Energy Drink · 2026*
