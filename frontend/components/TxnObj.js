import React, { useState, useEffect } from 'react';

const TxnObj = ({txn}) => {
  let color = "red"
  let text = ''
  if (txn.type === 'BUY') {
    color = 'green'
    text = `${txn.account} BOUGHT ${txn.quantity} ${txn.share_type} shares`
  }
  else if (txn.type === 'INVOICE_SUBMITTED') {
    color = 'blue'
    text = `${txn.account} submitted invoice ${txn.invoice_id} for ${txn.invoice_amount} NEAR => paid out ${txn.paid_out_amt} NEAR`    
  }
  else if (txn.type === 'INVOICE_PAID_BACK') {
    color = 'red'
    text = `${txn.account} paid ${txn.invoice_amount} NEAR for invoice ${txn.invoice_id}`
  }
  else if (txn.type === 'PROFIT_DISBURSAL') {
    color = 'purple'
    text = `${txn.profits_disbursed} NEAR disbursed as profits to shareholders in contract`
  } else {
    return null
  }

  return (
    <div className="txndiv">
      <div style={{width: '15px', height: '100%', backgroundColor: color}}></div>
      <div className="txntext">{text}</div>
    </div>
  )
}

export default TxnObj;