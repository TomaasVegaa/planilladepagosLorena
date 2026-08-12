import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CONSORCIO_INITIAL_OWNERS } from '../utils/constants';

export const useConsorcioStore = () => {
  const [owners, setOwners] = useState([]);
  const [payments, setPayments] = useState([]);
  const [finances, setFinances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Owners
      const { data: dbOwners, error: ownersError } = await supabase
        .from('consorcio_owners')
        .select('*')
        .order('order_num', { ascending: true });

      if (ownersError) {
        console.error('Error fetching owners:', ownersError);
        return;
      }

      // If database is empty, seed it with CONSORCIO_INITIAL_OWNERS
      if (!dbOwners || dbOwners.length === 0) {
        const initialData = CONSORCIO_INITIAL_OWNERS.map((name, index) => ({
          name,
          order_num: index + 1,
          status: 'active'
        }));

        const { data: newOwners, error: insertError } = await supabase
          .from('consorcio_owners')
          .insert(initialData)
          .select();

        if (insertError) {
          console.error('Error seeding owners:', insertError);
        } else if (newOwners) {
          setOwners(newOwners);
        }
      } else {
        setOwners(dbOwners);
      }

      // 2. Fetch Payments
      const { data: dbPayments, error: paymentsError } = await supabase
        .from('consorcio_payments')
        .select('*');
      if (!paymentsError && dbPayments) setPayments(dbPayments);

      // 3. Fetch Finances (Global Month Data)
      const { data: dbFinances, error: financesError } = await supabase
        .from('consorcio_finances')
        .select('*');
      if (!financesError && dbFinances) setFinances(dbFinances);

      // 4. Fetch Expenses
      const { data: dbExpenses, error: expensesError } = await supabase
        .from('consorcio_expenses')
        .select('*')
        .order('created_at', { ascending: true });
      if (!expensesError && dbExpenses) setExpenses(dbExpenses);

      setIsLoaded(true);
    };

    fetchData();
  }, []);

  // Update or insert a payment
  const updatePayment = async (ownerId, monthKey, amount, color) => {
    const existingPayment = payments.find(p => p.owner_id === ownerId && p.month_key === monthKey);
    
    if (existingPayment) {
      const { error } = await supabase
        .from('consorcio_payments')
        .update({ amount, color })
        .eq('id', existingPayment.id);
      
      if (!error) {
        setPayments(prev => prev.map(p => p.id === existingPayment.id ? { ...p, amount, color } : p));
      }
    } else {
      const { data, error } = await supabase
        .from('consorcio_payments')
        .insert([{ owner_id: ownerId, month_key: monthKey, amount, color }])
        .select();
        
      if (!error && data) {
        setPayments(prev => [...prev, data[0]]);
      }
    }
  };

  // Update finances for a month
  const updateFinances = async (monthKey, field, value) => {
    const existingFinance = finances.find(f => f.month_key === monthKey);
    const numericValue = parseFloat(value) || 0;

    if (existingFinance) {
      const { error } = await supabase
        .from('consorcio_finances')
        .update({ [field]: numericValue })
        .eq('id', existingFinance.id);
        
      if (!error) {
        setFinances(prev => prev.map(f => f.id === existingFinance.id ? { ...f, [field]: numericValue } : f));
      }
    } else {
      const { data, error } = await supabase
        .from('consorcio_finances')
        .insert([{ month_key: monthKey, [field]: numericValue }])
        .select();
        
      if (!error && data) {
        setFinances(prev => [...prev, data[0]]);
      }
    }
  };

  // Add Expense
  const addExpense = async (monthKey, detail, amount) => {
    const numericAmount = parseFloat(amount) || 0;
    const { data, error } = await supabase
      .from('consorcio_expenses')
      .insert([{ month_key: monthKey, detail, amount: numericAmount }])
      .select();
      
    if (!error && data) {
      setExpenses(prev => [...prev, data[0]]);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('consorcio_expenses')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  return {
    owners,
    payments,
    finances,
    expenses,
    isLoaded,
    updatePayment,
    updateFinances,
    addExpense,
    deleteExpense
  };
};
