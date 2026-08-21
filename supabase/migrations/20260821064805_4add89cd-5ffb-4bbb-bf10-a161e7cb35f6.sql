REVOKE EXECUTE ON FUNCTION public.track_order(text, text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_promo(text, integer) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_promo(text, integer) TO service_role;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;