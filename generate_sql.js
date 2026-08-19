import fs from 'fs';

const monthKeys = [
  '2026-01', '2026-02', '2026-03', '2026-04', 
  '2026-05', '2026-06', '2026-07', '2026-08'
];

const INITIAL_OWNERS = [
  "ALBORNOZ ADRIAN", "ARGAÑARAZ PEDRO", "AYBAR DANIEL", "BARROS HERNAN",
  "BELTRAN LUUIS", "BONO ATILIO", "CATTANEO CONSTANZA", "DELGADO MARCELO",
  "FAGIOLI CRISTIAN", "FERULLO ALICIA", "FERULLO JOSE", "FILIPPI ROMINA",
  "GALIANO DANIEL", "GONZALEZ LUIS", "HERMOSILLA N/ARIAS R", "JEREZ LORENA",
  "JUAREZ NORMA", "LEITON DIEGO", "LEIVA DIEGO", "LEMOS PATRICIA",
  "MARTINEZ RIBO MIGUEL", "MELIAN RAQUEL", "MOLINA DIEGO", "MOLINA FEDERICO",
  "MONETTI ANA", "MONETTI ARMANDO", "MURUAGA OSVALDO", "ORLANDI C NAZARENO",
  "PIEROTTI ANAN MARIA", "RIERA MARTA", "ROBLES RAMON QUINO", "RODRIGUEZ VERONICA",
  "SANCHO MIÑANO CLARA", "SALVATORE BRUNO", "TOLL SOFIA MARIA", "VILLA SILVIA",
  "VILLARREAL MIRIAM"
];

const pMap = {
  "ALBORNOZ ADRIAN": [20000, 20000, 30000, 30000, 18000, 18000, 30000, null],
  "ARGAÑARAZ PEDRO": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "AYBAR DANIEL": [15000, 15000, 30000, 30000, 18000, 18000, null, null],
  "BARROS HERNAN": [15000, 15000, 30000, 'yellow', 'yellow', 'green', null, null],
  "BELTRAN LUUIS": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "BONO ATILIO": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "CATTANEO CONSTANZA": [13000, 13000, 30000, 30000, 18000, 18000, 30000, null],
  "DELGADO MARCELO": [30000, 30000, 45000, 45000, 36000, 30000, 42000, null],
  "FAGIOLI CRISTIAN": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "FERULLO ALICIA": [20000, 25000, 30000, 30000, 40000, 40000, 52000, null],
  "FERULLO JOSE": [15000, 15000, 30000, 30000, 18000, 18000, 'green', null],
  "FILIPPI ROMINA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "GALIANO DANIEL": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "GONZALEZ LUIS": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "HERMOSILLA N/ARIAS R": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "JEREZ LORENA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "JUAREZ NORMA": ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', null],
  "LEITON DIEGO": [13000, 13000, 30000, 30000, 18000, 18000, 30000, null],
  "LEIVA DIEGO": [15000, 15000, 30000, 30000, { amount: 10000, color: 'yellow' }, 'yellow', 'green', null],
  "LEMOS PATRICIA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "MARTINEZ RIBO MIGUEL": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "MELIAN RAQUEL": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "MOLINA DIEGO": [15000, 15000, 30000, 30000, 18000, 30000, 30000, null],
  "MOLINA FEDERICO": ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'green', null],
  "MONETTI ANA": [20000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "MONETTI ARMANDO": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "MURUAGA OSVALDO": [15000, 15000, 15000, 15000, 18000, 18000, 18000, null],
  "ORLANDI C NAZARENO": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "PIEROTTI ANAN MARIA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, 18000],
  "RIERA MARTA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "ROBLES RAMON QUINO": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "RODRIGUEZ VERONICA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, 9000],
  "SANCHO MIÑANO CLARA": [null, null, null, null, 18000, 18000, 30000, null],
  "SALVATORE BRUNO": [13000, 13000, 30000, 30000, 18000, 18000, 30000, null],
  "TOLL SOFIA MARIA": [15000, 15000, 30000, 30000, 18000, 18000, 30000, null],
  "VILLA SILVIA": ['grey', 'grey', 'grey', 'grey', 18000, 18000, 30000, null],
  "VILLARREAL MIRIAM": [15000, 15000, 30000, 30000, 18000, 18000, 30000, 18000]
};

const expenses = [
  // Ene-26
  { month_key: '2026-01', detail: 'Corte Subida', amount: 50000 },
  { month_key: '2026-01', detail: 'Corte Plaza', amount: 35000 },
  { month_key: '2026-01', detail: 'Corte Predio', amount: 40000 },
  { month_key: '2026-01', detail: 'Serv/Acued', amount: 250000 },
  { month_key: '2026-01', detail: 'Internet Bomba', amount: 45000 },
  { month_key: '2026-01', detail: 'EDET', amount: 52050 },
  { month_key: '2026-01', detail: 'Mano de Obra', amount: 50000 },
  // Feb-26
  { month_key: '2026-02', detail: 'Corte Plaza', amount: 40000 },
  { month_key: '2026-02', detail: 'Internet Bomba', amount: 40000 },
  // Mar-26
  { month_key: '2026-03', detail: 'Corte Subida', amount: 50000 },
  { month_key: '2026-03', detail: 'Corte Plaza', amount: 40000 },
  { month_key: '2026-03', detail: 'Corte Predio', amount: 30000 },
  { month_key: '2026-03', detail: 'Serv/Acued', amount: 60000 },
  { month_key: '2026-03', detail: 'Internet Bomba', amount: 50000 },
  { month_key: '2026-03', detail: 'Agua/Inmob', amount: 101015.94 },
  { month_key: '2026-03', detail: 'EDET', amount: 96393.06 },
  { month_key: '2026-03', detail: 'Focos/materiales', amount: 90000 },
  { month_key: '2026-03', detail: 'Mano de Obra', amount: 605000 },
  // Abr-26
  { month_key: '2026-04', detail: 'Corte Subida', amount: 300000 },
  { month_key: '2026-04', detail: 'Corte Plaza', amount: 40000 },
  { month_key: '2026-04', detail: 'Corte Predio', amount: 25000 },
  { month_key: '2026-04', detail: 'Serv/Acued', amount: 40000 },
  { month_key: '2026-04', detail: 'Internet Bomba', amount: 50000 },
  { month_key: '2026-04', detail: 'Agua/Inmob', amount: 186571.36 },
  { month_key: '2026-04', detail: 'Focos/materiales', amount: 178180 },
  { month_key: '2026-04', detail: 'Mano de obra', amount: 60000 },
  // May-26
  { month_key: '2026-05', detail: 'Corte Plaza', amount: 30000 },
  { month_key: '2026-05', detail: 'Corte Predio', amount: 40000 },
  { month_key: '2026-05', detail: 'Serv/Acued', amount: 25000 },
  { month_key: '2026-05', detail: 'Internet Bomba', amount: 52000 },
  { month_key: '2026-05', detail: 'EDET', amount: 74750 },
  { month_key: '2026-05', detail: 'Focos/materiales', amount: 104000 },
  { month_key: '2026-05', detail: 'Mano de obra', amount: 400000 },
  // Jun-26
  { month_key: '2026-06', detail: 'Corte Subida', amount: 40000 },
  { month_key: '2026-06', detail: 'Corte Plaza', amount: 25000 },
  { month_key: '2026-06', detail: 'Corte Predio', amount: 250000 },
  { month_key: '2026-06', detail: 'Serv/Acued', amount: 40000 },
  { month_key: '2026-06', detail: 'Internet Bomba', amount: 50000 },
  { month_key: '2026-06', detail: 'Agua/Inmob', amount: 34437 },
  { month_key: '2026-06', detail: 'EDET', amount: 107020 },
  { month_key: '2026-06', detail: 'Focos/materiales', amount: 12000 },
  { month_key: '2026-06', detail: 'Mano de obra', amount: 310000 },
  // Jul-26
  { month_key: '2026-07', detail: 'Internet bomba', amount: 50000 },
  { month_key: '2026-07', detail: 'Agua/Inmob', amount: 34950 },
  { month_key: '2026-07', detail: 'Focos/materiales', amount: 360000 },
  { month_key: '2026-07', detail: 'Mano de obra', amount: 494200 }
];

const finances = [
  { month_key: '2026-01', rendimiento_nx: 3951.60, saldo_anterior: -32367.00 },
  { month_key: '2026-02', rendimiento_nx: 6219 },
  { month_key: '2026-03', rendimiento_nx: 6216, otros_ingresos: 19000 },
  { month_key: '2026-04', rendimiento_nx: 2291 },
  { month_key: '2026-05', rendimiento_nx: 3394 },
  { month_key: '2026-06', rendimiento_nx: 3220, aportes_extra: 113000 },
  { month_key: '2026-07', rendimiento_nx: 6936 },
  { month_key: '2026-08', rendimiento_nx: 60, aportes_extra: 10000 }
];

let sql = `-- SCRIPT DE MIGRACIÓN DE DATOS - CONSORCIO
-- Borramos datos existentes para no duplicar
TRUNCATE TABLE public.consorcio_payments CASCADE;
TRUNCATE TABLE public.consorcio_expenses CASCADE;
TRUNCATE TABLE public.consorcio_finances CASCADE;
TRUNCATE TABLE public.consorcio_owners CASCADE;

-- 1. Insertar Propietarios (Guardamos los IDs usando un UUID constante para cada uno basado en su orden)
`;

INITIAL_OWNERS.forEach((name, i) => {
  const uuid = `11111111-1111-1111-1111-${(i+1).toString().padStart(12, '0')}`;
  sql += `INSERT INTO public.consorcio_owners (id, order_num, name, status) VALUES ('${uuid}', ${i+1}, '${name}', 'active');\n`;
});

sql += `\n-- 2. Insertar Gastos\n`;
expenses.forEach(e => {
  sql += `INSERT INTO public.consorcio_expenses (month_key, detail, amount) VALUES ('${e.month_key}', '${e.detail}', ${e.amount});\n`;
});

sql += `\n-- 3. Insertar Finanzas Globales\n`;
finances.forEach(f => {
  const rn = f.rendimiento_nx || 0;
  const sa = f.saldo_anterior || 0;
  const ae = f.aportes_extra || 0;
  const oi = f.otros_ingresos || 0;
  sql += `INSERT INTO public.consorcio_finances (month_key, rendimiento_nx, saldo_anterior, aportes_extra, otros_ingresos) VALUES ('${f.month_key}', ${rn}, ${sa}, ${ae}, ${oi});\n`;
});

sql += `\n-- 4. Insertar Pagos de Propietarios\n`;
INITIAL_OWNERS.forEach((name, index) => {
  const uuid = `11111111-1111-1111-1111-${(index+1).toString().padStart(12, '0')}`;
  const ownerData = pMap[name];
  if (ownerData) {
    for (let i = 0; i < ownerData.length; i++) {
      const p = ownerData[i];
      if (p !== null) {
        let amount = 0;
        let color = 'none';
        if (typeof p === 'number') {
          amount = p;
        } else if (typeof p === 'string') {
          color = p;
        } else if (typeof p === 'object') {
          amount = p.amount || 0;
          color = p.color || 'none';
        }
        sql += `INSERT INTO public.consorcio_payments (owner_id, month_key, amount, color) VALUES ('${uuid}', '${monthKeys[i]}', ${amount}, '${color}');\n`;
      }
    }
  }
});

fs.writeFileSync('seed_consorcio.sql', sql);
console.log("SQL script generated at seed_consorcio.sql");
