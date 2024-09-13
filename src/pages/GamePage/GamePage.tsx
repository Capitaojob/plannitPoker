import React from 'react';
import { Poker } from '../../components/Poker/Poker';
import './GamePage.css';

export const GamePage = () => {
  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <Poker />
    </div>
  );
};
