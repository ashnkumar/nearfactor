import React, { useState, useEffect } from 'react';
import TxnObj from './TxnObj';

const TxnsDisplay = ({allTxns}) => {

  return (
    <div className="rightdiv">
      <div className="ledgertitledevi txns">
        <div className="ledgertitletext">Transactions</div>
      </div>
      <div className="txnholderdiv">
        {
          allTxns.map((t) => <TxnObj key={`k${getRandomInt(999)}`} txn={t} />)
        }
      </div>
    </div>
  )
}

export default TxnObj;