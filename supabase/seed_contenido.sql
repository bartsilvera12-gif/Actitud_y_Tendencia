-- Contenido inicial: textos tomados literalmente de los componentes actuales,
-- para que la web se vea exactamente igual tras conectarla a la base.

BEGIN;

-- Configuración del sitio (singleton) ---------------------------------------
INSERT INTO actitudytendencia.configuracion_sitio
  (nombre_marca, whatsapp_numero, whatsapp_display, whatsapp_mensaje_general,
   ubicacion, seo_title, seo_description, logo_url, favicon_url)
VALUES (
  'Actitud & Tendencia',
  '595985960203',
  '+595 985 960 203',
  '¡Hola Actitud & Tendencia! 🌷 Quería consultar por la nueva colección.',
  'San Lorenzo · Paraguay',
  'Actitud & Tendencia | Boutique de Moda Femenina',
  'Actitud & Tendencia — boutique de moda femenina. Prendas seleccionadas para expresar tu estilo, actitud y personalidad. Consultá por WhatsApp.',
  '/brand/logo-gold.png',
  '/brand/logo-gold.png'
)
ON CONFLICT (singleton) DO NOTHING;

-- Redes sociales ------------------------------------------------------------
INSERT INTO actitudytendencia.redes_sociales (tipo, nombre, usuario, url, orden) VALUES
  ('instagram', 'Instagram', 'actitud_tendencia.sdg', 'https://instagram.com/actitud_tendencia.sdg', 0),
  ('facebook',  'Actitud y Tendencia', NULL, 'https://www.facebook.com/share/1Gcj44PBMg/?mibextid=wwXIfr', 1),
  ('tiktok',    'TikTok', 'actitudytendencia', 'https://tiktok.com/@actitudytendencia', 2)
ON CONFLICT DO NOTHING;

-- Secciones del home --------------------------------------------------------
INSERT INTO actitudytendencia.secciones_home
  (clave, eyebrow, titulo, titulo_destacado, descripcion, orden, activo) VALUES
  ('hero', NULL, 'Vestí tu', 'actitud.', 'Prendas elegidas para acompañar tu estilo y expresar quién sos. Presentación cuidada y atención que te acompaña hasta la compra.', 0, true),
  ('categorias', 'Categorías', 'Comprá por categoría', NULL, NULL, 1, true),
  ('productos', 'Productos', 'Encontrá tu próxima', 'prenda favorita', 'Piezas seleccionadas de nuestra línea Giverny y básicos que combinan con todo. Tocá una prenda para ver el detalle y consultá por WhatsApp.', 2, true),
  ('nuevos_ingresos', 'Nuevos ingresos', 'Lo último de la línea', 'Giverny', NULL, 3, true),
  ('manifesto', 'Nuestra esencia', 'No seguimos tendencias.', 'Las hacemos parte de tu historia.', 'Elegí con actitud y vestí la tendencia a tu manera. Cada pieza está pensada para que el producto se vea mejor, se entienda rápido y te acompañe con una atención cercana.', 4, true),
  ('lookbook', NULL, NULL, NULL, NULL, 5, true),
  ('redes', NULL, 'Seguinos en', 'nuestras redes', NULL, 6, true),
  ('whatsapp_cta', 'Atención personalizada', '¿Viste algo que', 'te guste?', 'Escribinos por WhatsApp y te ayudamos a elegir tu talle, ver disponibilidad y coordinar el envío. Atención cercana y sin vueltas.', 7, true)
ON CONFLICT (clave) DO NOTHING;

-- Hero ----------------------------------------------------------------------
INSERT INTO actitudytendencia.hero_banners
  (etiqueta, titulo_linea_1, titulo_destacado_1, titulo_linea_2, titulo_destacado_2,
   descripcion, imagen_url, orden, activo)
VALUES (
  'Nueva colección · Verano',
  'Vestí tu', 'actitud.',
  'Marcá', 'tendencia.',
  'Prendas elegidas para acompañar tu estilo y expresar quién sos. Presentación cuidada y atención que te acompaña hasta la compra.',
  '/brand/hero-fondo.png',
  0, true
)
ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.hero_chips (hero_id, texto, color, orden)
SELECT h.id, v.texto, v.color, v.orden
FROM actitudytendencia.hero_banners h
CROSS JOIN (VALUES
  ('Nuevos ingresos cada semana', 'rosa', 0),
  ('Atención por WhatsApp', 'menta', 1),
  ('Prendas seleccionadas', 'amarillo', 2)
) AS v(texto, color, orden)
WHERE h.orden = 0
  AND NOT EXISTS (SELECT 1 FROM actitudytendencia.hero_chips c WHERE c.hero_id = h.id);

-- Valores del manifiesto ----------------------------------------------------
INSERT INTO actitudytendencia.manifiesto_valores (texto, color, orden) VALUES
  ('Fresca', 'menta', 0),
  ('Elegante', 'lila', 1),
  ('Cercana', 'rosa', 2),
  ('Actual', 'amarillo', 3),
  ('Detallista', 'salvia', 4)
ON CONFLICT DO NOTHING;

-- Lookbook: los dos productos que hoy están hardcodeados en Lookbook.tsx -----
INSERT INTO actitudytendencia.lookbook_items (producto_id, orden)
SELECT p.id, v.orden
FROM (VALUES
  ('blusa-tricot-sinmanga-giverny-offwhite', 0),
  ('regata-canelada-lilas', 1)
) AS v(slug, orden)
JOIN actitudytendencia.productos p ON p.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM actitudytendencia.lookbook_items l WHERE l.producto_id = p.id);

COMMIT;
