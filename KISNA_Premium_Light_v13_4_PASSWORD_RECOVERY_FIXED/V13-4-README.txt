KISNA v13.4 — CORRECCIÓN DEFINITIVA DEL CONFLICTO DE REDIRECCIÓN

Problema encontrado en v13.3:
El index.html contenía dos bloques de redirección.
Uno enviaba recovery_token a /recuperar.html y el otro lo enviaba de nuevo a /admin/.
Los dos bloques competían entre sí.

Corrección:
- Solo queda un bloque de redirección.
- recovery_token va únicamente a /recuperar.html.
- La página /recuperar.html conserva el token en la URL.
- El widget oficial de Netlify Identity procesa el token y muestra el formulario.
- Se desactiva la caché en portada, página de recuperación y administración.

Prueba después de desplegar:
1. Abre https://kisnalisado.es/recuperar.html
2. Sin token debe mostrar que el enlace no es válido.
3. Solicita UN correo nuevo de restablecimiento.
4. Abre únicamente el enlace más reciente.
