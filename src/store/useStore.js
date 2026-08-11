import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const INITIAL_NAMES = [
  "Dani", "Lore", "Fabi", "Nancy", "Lita", "Ele", "Roxana", "Elvira", 
  "Sole", "Buby", "Claudia", "Moni", "Rulo", "Ester", "Lisy", "Ely", 
  "Su liberto", "Sandra", "Gallega", "Pocha", "Lucy", "Isa"
];

export const useStore = () => {
  const [players, setPlayers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Players
      const { data: dbPlayers, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: true });

      if (playersError) {
        console.error('Error fetching players:', playersError);
        return;
      }

      // If database is empty, seed it with INITIAL_NAMES
      if (!dbPlayers || dbPlayers.length === 0) {
        const initialData = INITIAL_NAMES.map(name => ({
          name,
          last_name: '',
          status: 'active'
        }));

        const { data: newPlayers, error: insertError } = await supabase
          .from('players')
          .insert(initialData)
          .select();

        if (insertError) {
          console.error('Error seeding players:', insertError);
        } else if (newPlayers) {
          setPlayers(newPlayers.map(p => ({ ...p, lastName: p.last_name })));
        }
      } else {
        setPlayers(dbPlayers.map(p => ({ ...p, lastName: p.last_name })));
      }

      // 2. Fetch Payments
      const { data: dbPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*');
        
      if (!paymentsError && dbPayments) {
        setPayments(dbPayments.map(p => ({
          id: p.id,
          playerId: p.player_id,
          monthKey: p.month_key,
          amount: p.amount,
          paidAt: p.paid_at
        })));
      }

      setIsLoaded(true);
    };

    fetchData();
  }, []);

  const addPlayer = async (name, lastName) => {
    const { data, error } = await supabase
      .from('players')
      .insert([{ name, last_name: lastName, status: 'active' }])
      .select()
      .single();

    if (!error && data) {
      setPlayers([...players, { ...data, lastName: data.last_name }]);
    }
  };

  const editPlayer = async (id, newName, newLastName) => {
    // Optimistic UI update
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName, lastName: newLastName } : p));
    
    // DB update
    await supabase
      .from('players')
      .update({ name: newName, last_name: newLastName })
      .eq('id', id);
  };

  const toggleBaja = async (id) => {
    const player = players.find(p => p.id === id);
    if (!player) return;
    
    const newStatus = player.status === 'active' ? 'baja' : 'active';
    
    // Optimistic UI update
    setPlayers(players.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    // DB update
    await supabase
      .from('players')
      .update({ status: newStatus })
      .eq('id', id);
  };

  const togglePayment = async (playerId, monthKey) => {
    const player = players.find(p => p.id === playerId);
    if (player?.status === 'baja') return;

    const existingPayment = payments.find(p => p.playerId === playerId && p.monthKey === monthKey);
    
    if (existingPayment) {
      // Optimistic delete
      setPayments(payments.filter(p => p.id !== existingPayment.id));
      
      // DB delete
      await supabase
        .from('payments')
        .delete()
        .eq('id', existingPayment.id);
    } else {
      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const newPayment = {
        id: tempId,
        playerId,
        monthKey,
        amount: 25000,
        paidAt: new Date().toISOString()
      };
      
      // Optimistic insert
      setPayments([...payments, newPayment]);
      
      // DB insert
      const { data, error } = await supabase
        .from('payments')
        .insert([{ player_id: playerId, month_key: monthKey, amount: 25000 }])
        .select()
        .single();
        
      if (!error && data) {
        // Update temporary payment with real DB data
        setPayments(prev => prev.map(p => p.id === tempId ? {
          id: data.id,
          playerId: data.player_id,
          monthKey: data.month_key,
          amount: data.amount,
          paidAt: data.paid_at
        } : p));
      } else {
        // Revert on error
        setPayments(prev => prev.filter(p => p.id !== tempId));
      }
    }
  };

  return {
    players,
    payments,
    isLoaded,
    addPlayer,
    editPlayer,
    toggleBaja,
    togglePayment
  };
};
