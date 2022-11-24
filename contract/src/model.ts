import { UnorderedMap, Vector } from "near-sdk-js";

export class ProfitDisbursalEntry {
  timestamp: number;
  disbursed: number;
  
  constructor({ timestamp, disbursed }: ProfitDisbursalEntry) {
    this.timestamp = timestamp;
    this.disbursed = disbursed;
  }
}

export class InvoiceEntry {
  invoice_id: string;
  invoicer_acct: string;
  risk_level: string;
  invoice_amount: number;
  payor_acct: string;
  payout_amt: number;
  invoice_take_rate: number;
  ipfs_link: string;
  invoice_profit: number;
  is_paid: boolean;
  profits_disbursed: boolean;
  payback_date: number;
  borrow_date: number;
  
  constructor({invoicer_acct, 
              invoice_id, 
              risk_level,
              invoice_amount, 
              payor_acct,
              payout_amt,
              invoice_take_rate,
              timestamp,
              ipfs_link}) {
    this.invoice_id = invoice_id
    this.invoicer_acct = invoicer_acct
    this.risk_level = risk_level,
    this.invoice_amount = invoice_amount
    this.payor_acct = payor_acct
    this.payout_amt = payout_amt
    this.invoice_take_rate = invoice_take_rate
    this.ipfs_link = ipfs_link
    this.invoice_profit = 0
    this.is_paid = false
    this.profits_disbursed = false
    this.payback_date = 0
    this.borrow_date = timestamp;
  }
}


export class InvestorEntry {
  investor_acct: string;
  // share_txns = new Vector('investorvector');
  higher_risk_shares: number;
  medium_risk_shares: number;
  low_risk_shares: number;
  
  constructor(_investor_acct) {
    this.investor_acct = _investor_acct
    this.higher_risk_shares = 0;
    this.medium_risk_shares = 0;
    this.low_risk_shares = 0;
  }
}