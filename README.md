# Plataforma Web - Dra. Maribel Peña Duran

Sitio web profesional en espanol para consulta psicologica con enfoque en conversion, confianza clinica y cumplimiento legal.

## Estructura incluida

- `index.html`: Home con propuesta de valor, CTA, servicios destacados, testimonios y recursos.
- `sobre-mi.html`: Perfil profesional, credenciales, licencia y filosofia terapeutica.
- `servicios.html`: Sesiones, terapia de pareja, evaluaciones, membresias y productos digitales.
- `blog.html` + `articulo-*.html`: Centro de recursos SEO para ansiedad, relaciones y estres.
- `testimonios.html`: Resenas anonimizadas con nota legal.
- `contacto.html`: Formulario de contacto con consentimiento digital.
- `admision.html`: Intake form completo previo a primera consulta.
- `portal.html`: Portal del cliente con login, citas, facturas y recursos (demo local).
- `legal.html`: Politicas de privacidad, terminos, consentimiento y cancelacion.
- `robots.txt` y `sitemap.xml`: Base SEO tecnica.

## Configuracion rapida

1. Edita `assets/js/config.js` y reemplaza links placeholder por tus URLs reales:
   - GoHighLevel (calendario, lead magnet, triage, checkout)
   - WhatsApp Business
   - Stripe / PayPal
2. Reemplaza el numero de licencia `[COLPSIC-00000]` en las paginas.
3. Verifica correo de contacto y horarios.

## Ejecutar localmente

```bash
cd "/Users/macbookair/estudio/dra maribel "
python3 -m http.server 8080
```

Abre `http://localhost:8080`.

## Nota tecnica importante

- Formularios y portal funcionan en modo demo con `localStorage` (sin backend real).
- Para produccion, conecta:
  - **Supabase** para datos de formularios, blog, testimonios y usuarios.
  - **Stripe/PayPal** para cobros reales y suscripciones.
  - **GoHighLevel** para automatizaciones, CRM y workflows.
- Implementa HTTPS, control de acceso y cifrado para datos sensibles de salud.
