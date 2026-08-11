import { useState, useEffect } from 'react';

const STORAGE_KEY = 'basquet_pagos_data_v2';

const INITIAL_NAMES = [
  "Dani", "Lore", "Fabi", "Nancy", "Lita", "Ele", "Roxana", "Elvira", 
  "Sole", "Buby", "Claudia", "Moni", "Rulo", "Ester", "Lisy", "Ely", 
  "Su liberto", "Sandra", "Gallega", "Pocha", "Lucy", "Isa"
];

const INITIAL_PLAYERS = INITIAL_NAMES.map((name, index) => ({
  id: `initial-${index}`,
  name,
  lastName: '',
  status: 'active', // 'active' | 'baja'
  createdAt: new Date().toISOString()
}));

export const useStore = () => {
  const [players, setPlayers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { players: savedPlayers, payments: savedPayments } = JSON.parse(savedData);
      setPlayers(savedPlayers || INITIAL_PLAYERS);
      setPayments(savedPayments || []);
    } else {
      setPlayers(INITIAL_PLAYERS);
      setPayments([]);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, payments }));
    }
  }, [players, payments, isLoaded]);

  const addPlayer = (name, lastName) => {
    const newPlayer = {
      id: Date.now().toString(),
      name,
      lastName,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setPlayers([...players, newPlayer]);
  };

  const editPlayer = (id, newName, newLastName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName, lastName: newLastName } : p));
  };

  const toggleBaja = (id) => {
    setPlayers(players.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'baja' : 'active' } : p));
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
    setPayments(payments.filter(p => p.playerId !== id));
  };

  const togglePayment = (playerId, monthKey) => {
    // Prevent payment changes if player is baja
    const player = players.find(p => p.id === playerId);
    if (player?.status === 'baja') return;

    const existingPayment = payments.find(p => p.playerId === playerId && p.monthKey === monthKey);
    
    if (existingPayment) {
      setPayments(payments.filter(p => p.id !== existingPayment.id));
    } else {
      const newPayment = {
        id: Date.now().toString(),
        playerId,
        monthKey,
        amount: 25000,
        paidAt: new Date().toISOString()
      };
      setPayments([...payments, newPayment]);
    }
  };

  return {
    players,
    payments,
    addPlayer,
    editPlayer,
    removePlayer,
    toggleBaja,
    togglePayment
  };
};
