-- Tabla de Jugadoras
CREATE TABLE public.players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  last_name text,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Pagos
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES public.players(id) ON DELETE CASCADE,
  month_key text NOT NULL,
  amount numeric DEFAULT 25000,
  paid_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(player_id, month_key) -- Evita pagos duplicados del mismo mes
);

-- Habilitar acceso público (Solo para este MVP sin autenticación)
-- En un entorno de producción estricto deberías habilitar RLS y usar políticas.
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Allow public read access on payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on payments" ON public.payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on payments" ON public.payments FOR DELETE USING (true);
