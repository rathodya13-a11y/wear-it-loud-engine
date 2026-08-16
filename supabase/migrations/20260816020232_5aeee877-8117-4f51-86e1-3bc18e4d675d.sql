CREATE TABLE public.inventory (
  product_slug text NOT NULL,
  size text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_slug, size)
);
GRANT SELECT ON public.inventory TO anon;
GRANT SELECT ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inventory is publicly readable" ON public.inventory FOR SELECT TO anon, authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER TABLE public.inventory REPLICA IDENTITY FULL;

INSERT INTO public.inventory (product_slug, size, stock) VALUES
('no-mercy-black','S',0),('no-mercy-black','M',3),('no-mercy-black','L',12),('no-mercy-black','XL',8),('no-mercy-black','XXL',2),
('statement-white','S',6),('statement-white','M',9),('statement-white','L',4),('statement-white','XL',11),('statement-white','XXL',5),
('midnight-frame','S',2),('midnight-frame','M',0),('midnight-frame','L',7),('midnight-frame','XL',5),('midnight-frame','XXL',3),
('skull-crew','S',4),('skull-crew','M',14),('skull-crew','L',10),('skull-crew','XL',0),('skull-crew','XXL',6),
('riot-red-type','S',8),('riot-red-type','M',12),('riot-red-type','L',15),('riot-red-type','XL',9),('riot-red-type','XXL',4),
('shadow-drop','S',1),('shadow-drop','M',2),('shadow-drop','L',3),('shadow-drop','XL',2),('shadow-drop','XXL',0),
('static-grey','S',5),('static-grey','M',7),('static-grey','L',9),('static-grey','XL',6),('static-grey','XXL',2),
('bone-white-crew','S',10),('bone-white-crew','M',10),('bone-white-crew','L',10),('bone-white-crew','XL',10),('bone-white-crew','XXL',8);

CREATE TABLE public.promo_codes (
  code text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('percent','flat')),
  value numeric NOT NULL CHECK (value > 0),
  min_subtotal integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

INSERT INTO public.promo_codes (code, kind, value, min_subtotal) VALUES
('LOUD10','percent',10,0),
('FLASH20','percent',20,1499);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  pin text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal integer NOT NULL,
  discount integer NOT NULL DEFAULT 0,
  shipping integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  promo_code text,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','packed','shipped','out_for_delivery','delivered','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.validate_promo(_code text, _subtotal integer)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE p public.promo_codes; d integer;
BEGIN
  SELECT * INTO p FROM public.promo_codes WHERE upper(code) = upper(trim(_code));
  IF p.code IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'That code doesn''t exist.');
  END IF;
  IF NOT p.active OR (p.expires_at IS NOT NULL AND p.expires_at < now()) THEN
    RETURN jsonb_build_object('ok', false, 'message', 'That code has expired.');
  END IF;
  IF _subtotal < p.min_subtotal THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Add more to your cart to use this code.');
  END IF;
  IF p.kind = 'percent' THEN
    d := floor(_subtotal * p.value / 100.0);
  ELSE
    d := least(p.value::integer, _subtotal);
  END IF;
  RETURN jsonb_build_object('ok', true, 'code', upper(p.code), 'kind', p.kind, 'value', p.value, 'discount', d);
END;
$$;
GRANT EXECUTE ON FUNCTION public.validate_promo(text, integer) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.track_order(_order_code text, _email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE o public.orders;
BEGIN
  SELECT * INTO o FROM public.orders
  WHERE upper(order_code) = upper(trim(_order_code))
    AND lower(email) = lower(trim(_email));
  IF o.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'No order matches that order ID and email.');
  END IF;
  RETURN jsonb_build_object(
    'ok', true,
    'order_code', o.order_code,
    'status', o.status,
    'full_name', o.full_name,
    'city', o.city,
    'items', o.items,
    'subtotal', o.subtotal,
    'discount', o.discount,
    'shipping', o.shipping,
    'total', o.total,
    'promo_code', o.promo_code,
    'created_at', o.created_at
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();