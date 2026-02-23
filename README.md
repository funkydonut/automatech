# Automatech

Landing page para **Automatech** - Agencia de automatización de procesos para pymes y profesionales autónomos.

## Descripción

Automatech es una agencia especializada en dos servicios principales:

1. **Automatización de Procesos**: Cobros, reservas, agenda, presupuestos y más.
2. **Agentes Inteligentes**: Implementación de asistentes de chat y voz con IA.

## Tecnologías

- **HTML5** - Estructura semántica
- **Tailwind CSS v4** - Framework de utilidades CSS
- **JavaScript (Vanilla)** - Interactividad sin dependencias
- **Lexend Deca** - Tipografía principal (Google Fonts)
- **Lucide Icons** - Iconografía (CDN)

## Estructura del Proyecto

```
automatech/
├── dist/
│   └── output.css          # CSS compilado (generado)
├── js/
│   └── main.js             # JavaScript principal
├── src/
│   └── input.css           # Estilos Tailwind + custom
├── index.html              # Página principal
├── package.json            # Configuración npm
└── README.md               # Documentación
```

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

## Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd automatech
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Compilar CSS**

```bash
npm run build
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila y minifica el CSS para producción |
| `npm run dev` | Modo desarrollo con watch (recompila automáticamente) |
| `npm run watch` | Alias de `dev` |

## Desarrollo

Para trabajar en el proyecto:

1. Ejecutar el modo desarrollo:

```bash
npm run dev
```

2. Abrir `index.html` en el navegador (o usar un servidor local como Live Server).

3. Los cambios en `src/input.css` se recompilarán automáticamente.

## Demo de agente de voz (ElevenLabs)

Se añadió una página de demo lista para compartir: `voice-demo.html` (alias estable).

- **Configurar el agente (recomendado)**: edita `voice-demo.config.json` y pega tu `agentId`.
- **Abrir demo**: `voice-demo.html` (alias estable que redirige a `voice-demo-landings/voice-demo.html` y conserva query params) o `voice-demo.html?agent=TU_AGENT_ID` (override por URL).
- **Abrir landing genérica directamente**: `voice-demo-landings/voice-demo.html`
- **Abrir variante Trasteros directamente**: `voice-demo-landings/voice-demo-trasteros.html`
- **Configurar fijo (opcional)**: edita `DEFAULT_AGENT_ID` dentro de `voice-demo-landings/voice-demo.html` (o dentro de cada variante) (no recomendado si ya usas el JSON).

El CTA **“Probar Ahora”** del card **“Agentes Telefónicos”** en `index.html` apunta a esta demo.

## Secciones de la Landing

| Sección | Descripción |
|---------|-------------|
| **Header** | Navegación sticky con efecto blur al scroll |
| **Hero** | Headline principal, CTAs y estadísticas |
| **Servicios** | 2 cards destacando los servicios principales |
| **Beneficios** | Grid de 6 ventajas de la automatización |
| **Proceso** | Timeline de 4 pasos (Análisis → Diseño → Implementación → Soporte) |
| **Testimonios** | Carousel con testimonios de clientes |
| **FAQ** | Acordeón con preguntas frecuentes |
| **Contacto** | Formulario con validación |
| **Footer** | Links, redes sociales e información de contacto |

## Paleta de Colores (Clean White Tech)

| Rol | Color | Hex |
|-----|-------|-----|
| Fondo principal | Blanco puro | `#ffffff` |
| Fondo secundario | Gris muy claro | `#f8fafc` |
| Superficies/cards | Blanco | `#f1f5f9` |
| Bordes | Gris claro | `#e2e8f0` |
| Acento primario | Azul tech | `#0ea5e9` |
| Acento secundario | Violeta | `#8b5cf6` |
| Texto principal | Casi negro | `#0f172a` |
| Texto secundario | Gris slate | `#64748b` |

## Características Técnicas

### Rendimiento
- CSS optimizado y minificado
- Fuentes con preconnect para carga rápida
- Iconos cargados desde CDN

### Accesibilidad
- Navegación por teclado
- Estados focus visibles
- Soporte para `prefers-reduced-motion`
- Estructura semántica HTML5

### Responsive
- Diseño mobile-first
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Menú móvil con toggle

### Animaciones
- Fade-in al scroll (Intersection Observer)
- Hover effects en cards
- Carousel de testimonios con swipe táctil
- Background con grid animado

## Personalización

### Modificar colores

Editar las variables CSS en `src/input.css` dentro del bloque `@theme`:

```css
@theme {
    --color-accent-blue: #0ea5e9;
    --color-accent-violet: #8b5cf6;
    /* ... */
}
```

### Añadir nuevas animaciones

Definir keyframes en el bloque `@theme`:

```css
@theme {
    --animate-custom: custom-animation 1s ease infinite;

    @keyframes custom-animation {
        /* ... */
    }
}
```

## Despliegue

Para producción:

1. Ejecutar build:

```bash
npm run build
```

2. Subir los siguientes archivos al servidor:
   - `index.html`
   - `dist/output.css`
   - `js/main.js`

### Opciones de hosting recomendadas

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

## Formulario de Contacto

El formulario envía las solicitudes a `diego@automatech.cx` mediante un endpoint serverless pensado para Vercel (`POST /api/contact`) y el proveedor de email **Resend**.

### Configuración (Vercel + Resend)

En Vercel, **Project Settings → Environment Variables**, define:
   - `RESEND_API_KEY` (requerida): API key de Resend.
   - `RESEND_FROM` (requerida en la práctica): remitente del email. Debe usar un dominio verificado en Resend.
     - Ejemplo (si tu dominio verificado es `@contact.automatech.cx`): `Automatech <no-reply@contact.automatech.cx>`
   - `CONTACT_TO` (opcional): destinatario final de las solicitudes. Por defecto `diego@automatech.cx`.
   - `ALLOWED_ORIGINS` (opcional): lista separada por comas para validar el header `Origin` (CORS).
     - Ejemplo: `https://automatech.cx,https://www.automatech.cx`

El endpoint está en `api/contact.js` y el frontend lo llama desde `js/main.js`.

### Notas sobre dominios en Resend

- **Dominio verificado**: si en Resend verificaste `contact.automatech.cx`, el `RESEND_FROM` debe ser algo como `no-reply@contact.automatech.cx`.
- **El destinatario (`CONTACT_TO`) no depende del dominio verificado**: puede ser `diego@automatech.cx` sin problema.

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Contacto

- **Web**: [automatech.cx](https://automatech.cx)
- **Email**: diego@automatech.cx

---

Desarrollado con ❤️ por Automatech
