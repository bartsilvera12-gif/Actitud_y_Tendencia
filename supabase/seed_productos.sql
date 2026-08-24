-- Seed generado desde src/data/products.ts. NO editar a mano.
-- Conserva nombres, precios, descripciones, talles y fotos exactos.

BEGIN;

-- Categorías ---------------------------------------------------------------
INSERT INTO actitudytendencia.categorias (nombre, slug, tema_color, flor_key, orden) VALUES
  ('Camisas', 'camisas', 'rosa', 'cosmosRosa', 0),
  ('Blusas', 'blusas', 'lila', 'cosmosLila', 1),
  ('Camisetas', 'camisetas', 'amarillo', 'cosmosAmarillo', 2),
  ('Regatas', 'regatas', 'menta', 'lavanda', 3),
  ('Chalecos', 'chalecos', 'salvia', 'cosmosLila', 4),
  ('Pantalones', 'pantalones', 'amarillo', 'ramilleteAmarillo', 5),
  ('Vestidos', 'vestidos', 'rosa', 'peoniaRosa', 6)
ON CONFLICT (slug) DO NOTHING;

-- Líneas -------------------------------------------------------------------
INSERT INTO actitudytendencia.lineas (nombre, slug, orden) VALUES
  ('Giverny', 'giverny', 0),
  ('Básicos', 'basicos', 1),
  ('Denim', 'denim', 2),
  ('Sastrería', 'sastreria', 3),
  ('Noche', 'noche', 4)
ON CONFLICT (slug) DO NOTHING;

-- Productos ----------------------------------------------------------------

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'camisa-giverny-estampada-offwhite', 'Camisa Giverny Estampada',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'camisas'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'giverny'),
  'Off-white', 299000, 'Camisa de manga corta en tejido liviano con estampado floral pintado a mano sobre base off-white. Caída fluida y frescura para el día.', 'numerico',
  true, false, true, true, 0, 0
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '36', 0 FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '38', 1 FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '40', 2 FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camisa-giverny-estampada-offwhite/01.webp', 'Camisa Giverny Estampada', 0, true FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camisa-giverny-estampada-offwhite/02.webp', 'Camisa Giverny Estampada', 1, false FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camisa-giverny-estampada-offwhite/03.webp', 'Camisa Giverny Estampada', 2, false FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camisa-giverny-estampada-offwhite/04.webp', 'Camisa Giverny Estampada', 3, false FROM actitudytendencia.productos WHERE slug = 'camisa-giverny-estampada-offwhite'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'blusa-tricot-sinmanga-giverny-offwhite', 'Blusa Tricot Sin Manga Giverny',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'blusas'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'giverny'),
  'Off-white', 299000, 'Blusa de tricot sin mangas con gran flor pintada en tonos rosa y verde sobre off-white. Cuello redondo y terminación canelada.', 'letra',
  true, true, true, true, 1, 1
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'G', 2 FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-tricot-sinmanga-giverny-offwhite/01.webp', 'Blusa Tricot Sin Manga Giverny', 0, true FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-tricot-sinmanga-giverny-offwhite/02.webp', 'Blusa Tricot Sin Manga Giverny', 1, false FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-tricot-sinmanga-giverny-offwhite/03.webp', 'Blusa Tricot Sin Manga Giverny', 2, false FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-tricot-sinmanga-giverny-offwhite/04.webp', 'Blusa Tricot Sin Manga Giverny', 3, false FROM actitudytendencia.productos WHERE slug = 'blusa-tricot-sinmanga-giverny-offwhite'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'camiseta-fleurs-de-giverny-offwhite', 'Camiseta Fleurs de Giverny',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'camisetas'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'giverny'),
  'Off-white', 199000, 'Camiseta off-white de algodón con estampado ''Fleurs de Giverny'': una grilla botánica de flores en acuarela con lettering delicado.', 'letra',
  true, false, true, true, 2, 2
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'G', 2 FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camiseta-fleurs-de-giverny-offwhite/01.webp', 'Camiseta Fleurs de Giverny', 0, true FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camiseta-fleurs-de-giverny-offwhite/02.webp', 'Camiseta Fleurs de Giverny', 1, false FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camiseta-fleurs-de-giverny-offwhite/03.webp', 'Camiseta Fleurs de Giverny', 2, false FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/camiseta-fleurs-de-giverny-offwhite/04.webp', 'Camiseta Fleurs de Giverny', 3, false FROM actitudytendencia.productos WHERE slug = 'camiseta-fleurs-de-giverny-offwhite'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'regata-canelada-lilas', 'Regata Canelada Lilas',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'regatas'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'basicos'),
  'Lila', 199000, 'Regata canelada (rib) al cuerpo en un lila suave. Escote alto y calce prolijo: la base ideal para combinar con estampados.', 'letra',
  true, false, true, true, 3, 3
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/regata-canelada-lilas/01.webp', 'Regata Canelada Lilas', 0, true FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/regata-canelada-lilas/02.webp', 'Regata Canelada Lilas', 1, false FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/regata-canelada-lilas/03.webp', 'Regata Canelada Lilas', 2, false FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/regata-canelada-lilas/04.webp', 'Regata Canelada Lilas', 3, false FROM actitudytendencia.productos WHERE slug = 'regata-canelada-lilas'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'chaleco-jean-cinto', 'Chaleco de Jean con Cinto',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'chalecos'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'denim'),
  'Azul', 399000, 'Chaleco de jean con solapa cruzada, hombreras suaves y bolsillos redondeados. Incluye cinto trenzado que marca la cintura. Estructura moderna con actitud.', 'letra',
  true, false, true, true, 4, 4
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/chaleco-jean-cinto/01.webp', 'Chaleco de Jean con Cinto', 0, true FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/chaleco-jean-cinto/02.webp', 'Chaleco de Jean con Cinto', 1, false FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/chaleco-jean-cinto/03.webp', 'Chaleco de Jean con Cinto', 2, false FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/chaleco-jean-cinto/04.webp', 'Chaleco de Jean con Cinto', 3, false FROM actitudytendencia.productos WHERE slug = 'chaleco-jean-cinto'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'pantalon-jean', 'Pantalón de Jean',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'pantalones'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'denim'),
  'Azul', 399000, 'Pantalón de jean de tiro alto y pierna recta con caída fluida. Combina con el chaleco para un total denim.', 'letra',
  true, false, true, true, 5, 5
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-jean/03.webp', 'Pantalón de Jean', 0, true FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-jean/02.webp', 'Pantalón de Jean', 1, false FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-jean/04.webp', 'Pantalón de Jean', 2, false FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-jean/01.webp', 'Pantalón de Jean', 3, false FROM actitudytendencia.productos WHERE slug = 'pantalon-jean'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'pantalon-sastreria-cinto', 'Pantalón Sastrería con Cinto',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'pantalones'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'sastreria'),
  'Negro', 399000, 'Pantalón de sastrería de pierna ancha en negro, con cinto. Corte fluido y elegante para un look pulido de día o de noche.', 'numerico',
  true, false, true, true, 6, 6
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '36', 0 FROM actitudytendencia.productos WHERE slug = 'pantalon-sastreria-cinto'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sastreria-cinto/02.webp', 'Pantalón Sastrería con Cinto', 0, true FROM actitudytendencia.productos WHERE slug = 'pantalon-sastreria-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sastreria-cinto/01.webp', 'Pantalón Sastrería con Cinto', 1, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sastreria-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sastreria-cinto/03.webp', 'Pantalón Sastrería con Cinto', 2, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sastreria-cinto'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sastreria-cinto/04.webp', 'Pantalón Sastrería con Cinto', 3, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sastreria-cinto'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'vestido-cetim-lacy-negro', 'Vestido Cetim Degagê Lacy Negro',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'vestidos'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'noche'),
  'Negro', 499000, 'Vestido midi de cetim (satén) negro con escote drapeado, espalda descubierta y ruedo asimétrico rematado en encaje. Elegancia pura para la noche.', 'letra',
  true, true, true, true, 7, 7
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'P', 0 FROM actitudytendencia.productos WHERE slug = 'vestido-cetim-lacy-negro'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, 'M', 1 FROM actitudytendencia.productos WHERE slug = 'vestido-cetim-lacy-negro'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/vestido-cetim-lacy-negro/01.webp', 'Vestido Cetim Degagê Lacy Negro', 0, true FROM actitudytendencia.productos WHERE slug = 'vestido-cetim-lacy-negro'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/vestido-cetim-lacy-negro/02.webp', 'Vestido Cetim Degagê Lacy Negro', 1, false FROM actitudytendencia.productos WHERE slug = 'vestido-cetim-lacy-negro'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/vestido-cetim-lacy-negro/03.webp', 'Vestido Cetim Degagê Lacy Negro', 2, false FROM actitudytendencia.productos WHERE slug = 'vestido-cetim-lacy-negro'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'pantalon-sarja-lana-bege', 'Calça Sarja Lana Bege',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'pantalones'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'sastreria'),
  'Beige', 399000, 'Pantalón de sarga de pierna ancha en beige, tiro alto con detalle de botones y tabs en el ruedo. Un básico elevado, versátil y cómodo.', 'numerico',
  true, false, true, true, 8, 8
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '38', 0 FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '40', 1 FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sarja-lana-bege/01.webp', 'Calça Sarja Lana Bege', 0, true FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sarja-lana-bege/02.webp', 'Calça Sarja Lana Bege', 1, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sarja-lana-bege/03.webp', 'Calça Sarja Lana Bege', 2, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/pantalon-sarja-lana-bege/04.webp', 'Calça Sarja Lana Bege', 3, false FROM actitudytendencia.productos WHERE slug = 'pantalon-sarja-lana-bege'
  ON CONFLICT DO NOTHING;

INSERT INTO actitudytendencia.productos
  (slug, nombre, categoria_id, linea_id, color, precio, descripcion, tipo_talle,
   nuevo, destacado, activo, mostrar_home, orden_home, orden_catalogo)
VALUES (
  'blusa-corpete-alfaiataria-bege', 'Blusa con Corpete Alfaiataría Bege',
  (SELECT id FROM actitudytendencia.categorias WHERE slug = 'blusas'),
  (SELECT id FROM actitudytendencia.lineas     WHERE slug = 'sastreria'),
  'Beige', 799000, 'Blusa de dos texturas: base blanca de mangas cortas con un corpete de alfaiataría acoplado en beige, escote corazón y cinto con hebilla en D. Estructura que estiliza la silueta.', 'numerico',
  true, true, true, true, 9, 9
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO actitudytendencia.producto_talles (producto_id, talle, orden)
  SELECT id, '40', 0 FROM actitudytendencia.productos WHERE slug = 'blusa-corpete-alfaiataria-bege'
  ON CONFLICT (producto_id, talle) DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-corpete-alfaiataria-bege/01.webp', 'Blusa con Corpete Alfaiataría Bege', 0, true FROM actitudytendencia.productos WHERE slug = 'blusa-corpete-alfaiataria-bege'
  ON CONFLICT DO NOTHING;
INSERT INTO actitudytendencia.producto_imagenes (producto_id, url, alt_text, orden, principal)
  SELECT id, '/productos/blusa-corpete-alfaiataria-bege/02.webp', 'Blusa con Corpete Alfaiataría Bege', 1, false FROM actitudytendencia.productos WHERE slug = 'blusa-corpete-alfaiataria-bege'
  ON CONFLICT DO NOTHING;

COMMIT;
