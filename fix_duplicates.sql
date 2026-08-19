-- 1. Eliminar pagos duplicados generados por mala conexión a internet
-- Mantiene únicamente el último pago registrado (el más reciente) para cada propietario en cada mes
DELETE FROM public.consorcio_payments
WHERE id NOT IN (
    SELECT id FROM (
        SELECT id,
        ROW_NUMBER() OVER(PARTITION BY owner_id, month_key ORDER BY created_at DESC) as rn
        FROM public.consorcio_payments
    ) t
    WHERE t.rn = 1
);

-- 2. Agregar una regla estricta a la base de datos para que esto NUNCA vuelva a pasar
-- Supabase bloqueará automáticamente cualquier intento de crear un pago duplicado
ALTER TABLE public.consorcio_payments 
ADD CONSTRAINT unique_owner_month UNIQUE (owner_id, month_key);
