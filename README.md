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

El formulario actualmente simula el envío. Para conectarlo con un backend:

1. Modificar la función `simulateFormSubmission()` en `js/main.js`
2. Reemplazar con una llamada real a tu API:

```javascript
async function submitForm(form) {
    const formData = new FormData(form);
    
    const response = await fetch('https://tu-api.com/contact', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}
```

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Contacto

- **Web**: [automatech.es](https://automatech.es)
- **Email**: hola@automatech.es

---

Desarrollado con ❤️ por Automatech
