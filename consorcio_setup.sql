-- Script de configuración para el módulo de Consorcio

-- 1. Tabla de Propietarios
CREATE TABLE public.consorcio_owners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_num integer,
  name text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Pagos de Propietarios
CREATE TABLE public.consorcio_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES public.consorcio_owners(id) ON DELETE CASCADE,
  month_key text NOT NULL,
  amount numeric DEFAULT 0,
  color text DEFAULT 'none', -- 'none', 'yellow', 'green', 'grey'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Finanzas Mensuales (Ingresos extra, rendimiento, etc)
CREATE TABLE public.consorcio_finances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  month_key text NOT NULL UNIQUE,
  aportes_extra numeric DEFAULT 0,
  rendimiento_nx numeric DEFAULT 0,
  otros_ingresos numeric DEFAULT 0,
  saldo_anterior numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Gastos Mensuales (Egresos)
CREATE TABLE public.consorcio_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  month_key text NOT NULL,
  detail text NOT NULL,
  amount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) para todas las tablas nuevas
ALTER TABLE public.consorcio_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consorcio_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consorcio_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consorcio_expenses ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura/escritura pública (ideal para MVP)
CREATE POLICY "Allow public insert access on consorcio_owners" ON public.consorcio_owners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on consorcio_owners" ON public.consorcio_owners FOR SELECT USING (true);
CREATE POLICY "Allow public update access on consorcio_owners" ON public.consorcio_owners FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on consorcio_owners" ON public.consorcio_owners FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on consorcio_payments" ON public.consorcio_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on consorcio_payments" ON public.consorcio_payments FOR SELECT USING (true);
CREATE POLICY "Allow public update access on consorcio_payments" ON public.consorcio_payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on consorcio_payments" ON public.consorcio_payments FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on consorcio_finances" ON public.consorcio_finances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on consorcio_finances" ON public.consorcio_finances FOR SELECT USING (true);
CREATE POLICY "Allow public update access on consorcio_finances" ON public.consorcio_finances FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on consorcio_finances" ON public.consorcio_finances FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on consorcio_expenses" ON public.consorcio_expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on consorcio_expenses" ON public.consorcio_expenses FOR SELECT USING (true);
CREATE POLICY "Allow public update access on consorcio_expenses" ON public.consorcio_expenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on consorcio_expenses" ON public.consorcio_expenses FOR DELETE USING (true);
