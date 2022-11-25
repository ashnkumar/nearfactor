export const buildTxnArr = (data) => {
  let txns = []

  data.profit_disbursals.forEach((i) => {
    txns.push({
      type: "PROFIT_DISBURSAL",
      ts: i.timestamp,
      profits_disbursed: i.disbursed
    })
  })

  data.invoices.forEach((i) => {
    txns.push({
      type: "INVOICE_SUBMITTED",
      ts: i.borrowed_timestamp,
      invoice_id: i.invoice_id,
      account: i.invoicer_acct,
      invoice_amount: i.invoice_amount,
      paid_out_amt: i.payout_amt
    })

    if (i.is_paid) {
      txns.push({
        type: "INVOICE_PAID_BACK",
        ts: i.payback_timestamp,
        account: i.payor_account,
        invoice_amount: i.invoice_amount,
        invoice_id: i.invoice_id
      })      
    }
  })

  data.share_txns.forEach((i) => {
    if (i.investor_acct !== 'contract' && i.is_buying) {
      txns.push({
        type: "BUY",
        ts: i.timestamp,
        account: i.investor_acct,
        quantity: i.quantity,
        share_type: i.share_type
      })
    }
  })
  let sortedTxns = txns.sort((a,b) => b.ts - a.ts)
  return sortedTxns.slice(0,16)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}