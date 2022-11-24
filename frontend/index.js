// React
import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import './css/normalize.css'
import './css/w.css'
import './css/nearfactor.css'

// NEAR
import { NearFactor } from './near-interface';
import { Wallet } from './near-wallet';
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })
const nearFactor = new NearFactor({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()
 
  ReactDOM.render(
    <Dashboard isSignedIn={isSignedIn} nearFactor={nearFactor} wallet={wallet} />,
    document.getElementById('root')
  );
}