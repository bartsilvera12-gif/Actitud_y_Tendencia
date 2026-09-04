-- ============================================================================
--  Actitud & Tendencia · Precio de oferta
--
--  `precio_oferta` es opcional: NULL significa "sin oferta". Cuando tiene
--  valor, es el precio que se cobra, y el `precio` original se muestra tachado.
--
--  Va en bigint como `precio`: guaraníes, sin decimales, nada de floats.
--
--  Idempotente.
-- ============================================================================

alter table actitudytendencia.productos
  add column if not exists precio_oferta bigint;

-- La oferta tiene que ser menor al precio original, o no es una oferta.
-- Se permite NULL (sin oferta) y se rechaza el 0 para que "sin oferta" tenga
-- una sola representación posible.
alter table actitudytendencia.productos
  drop constraint if exists productos_precio_oferta_check;

alter table actitudytendencia.productos
  add constraint productos_precio_oferta_check
  check (precio_oferta is null or (precio_oferta > 0 and precio_oferta < precio));

comment on column actitudytendencia.productos.precio_oferta is
  'Precio promocional en guaraníes. NULL = sin oferta. Debe ser menor que precio.';

notify pgrst, 'reload schema';
