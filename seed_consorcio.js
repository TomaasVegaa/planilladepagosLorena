import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// 1. Parse .env file manually so we don't need to install dotenv
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

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

async function seed() {
  console.log("Starting seed process...");

  // 1. Ensure owners exist
  let { data: dbOwners, error: ownersError } = await supabase.from('consorcio_owners').select('*');
  if (ownersError) {
    console.error("Error fetching owners:", ownersError);
    return;
  }

  if (!dbOwners || dbOwners.length === 0) {
    console.log("Seeding owners...");
    const initialData = INITIAL_OWNERS.map((name, index) => ({ name, order_num: index + 1, status: 'active' }));
    const { error: insertErr } = await supabase.from('consorcio_owners').insert(initialData);
    if (insertErr) {
       console.error("Error inserting owners:", insertErr);
       return;
    }
    const res = await supabase.from('consorcio_owners').select('*');
    dbOwners = res.data || [];
  }

  
  // 2. Clear existing payments, finances, expenses to avoid duplicates
  console.log("Clearing existing data...");
  await supabase.from('consorcio_payments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('consorcio_expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('consorcio_finances').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 3. Seed Expenses
  console.log("Seeding expenses...");
  await supabase.from('consorcio_expenses').insert(expenses);

  // 4. Seed Finances
  console.log("Seeding finances...");
  await supabase.from('consorcio_finances').insert(finances);

  // 5. Seed Payments
  console.log("Seeding payments...");
  const paymentsToInsert = [];
  
  for (const owner of dbOwners) {
    const ownerData = pMap[owner.name];
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
          
          paymentsToInsert.push({
            owner_id: owner.id,
            month_key: monthKeys[i],
            amount: amount,
            color: color
          });
        }
      }
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < paymentsToInsert.length; i += 100) {
    const batch = paymentsToInsert.slice(i, i + 100);
    await supabase.from('consorcio_payments').insert(batch);
  }

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
