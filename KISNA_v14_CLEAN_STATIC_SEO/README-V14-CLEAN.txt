KISNA v14 CLEAN — STATIC SEO

Esta versión se creó sobre la descarga actual del repositorio de GitHub.

CONSERVADO
- Los 4 casos actuales del CMS.
- Todas las fotos utilizadas por esos casos.
- El acceso actual de Netlify Identity y Decap CMS.
- El diseño, diagnóstico, reseñas, contacto y SEO existente.

ELIMINADO
- Cinco carpetas completas de versiones antiguas v13.
- Archivos de instrucciones antiguos y duplicados.
- resultados-cms.js, porque los casos ya no se cargan con fetch.
- Dos fotos antiguas que eran copias exactas de las fotos guardadas en assets/resultados.

NUEVO
- build-resultados.js.
- Netlify ejecuta node build-resultados.js en cada despliegue.
- Los casos quedan escritos directamente en index.html y resultados.html.
- Google puede leer títulos, tipo de cabello, descripciones e imágenes sin esperar JavaScript.
- El CMS tiene el campo opcional “Descripción para Google”.
- Si ese campo está vacío, el build crea una descripción breve automáticamente.

DESPLIEGUE
Sube todo el contenido de este ZIP a la raíz del repositorio y reemplaza los archivos existentes.
Después espera a que Netlify indique Published.

COMPROBACIÓN
En el log de Netlify debe aparecer:
Resultados generados en HTML: 4 caso(s) publicado(s).
