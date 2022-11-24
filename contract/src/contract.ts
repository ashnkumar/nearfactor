import { NearBindgen, near, call, view, initialize, UnorderedMap, Vector } from 'near-sdk-js'
import { InvestorEntry, InvoiceEntry, ProfitDisbursalEntry } from './model'

const INIT_MINT_AMOUNT = 5000
const SHARE_INFO = {
  higher_risk: {
    share_price: 2.00,
    payout_perc: 0.80
  },
  medium_risk: {
    share_price: 3.00,
    payout_perc: 0.90
  },
  lower_risk: {
    share_price: 1.00,
    payout_perc: 0.95
  }
}

@NearBindgen({})
class NearFactor {
  profit_disbursals: ProfitDisbursalEntry[] = [];
  total_funds: number = 0;
  invoices = new UnorderedMap("invoices");
  investors = new UnorderedMap("investors")
  share_prices = new UnorderedMap("shares_info")
  share_txns = new Vector('share_txns')
  total_shares_outstanding = new UnorderedMap("shares_outstanding")

  @initialize({})
  init() {
    this.share_prices.set("higher_risk", SHARE_INFO.higher_risk.share_price)
    this.share_prices.set("medium_risk", SHARE_INFO.medium_risk.share_price)
    this.share_prices.set("lower_risk", SHARE_INFO.lower_risk.share_price)
    // this.investors.set("contract", new InvestorEntry("contract"))
    this.investors.set("contract", {
      investor_acct: "contract",
      higher_risk_shares: INIT_MINT_AMOUNT,
      medium_risk_shares: INIT_MINT_AMOUNT,
      lower_risk_shares: INIT_MINT_AMOUNT
    })
    this.total_shares_outstanding.set("higher_risk_shares", INIT_MINT_AMOUNT)
    this.total_shares_outstanding.set("medium_risk_shares", INIT_MINT_AMOUNT)
    this.total_shares_outstanding.set("lower_risk_shares", INIT_MINT_AMOUNT)
  }

  @view({})
  calculate_share_breakdowns() {
    let share_breakdowns = {
      higher_risk: {},
      medium_risk: {},
      lower_risk: {}
    }
    for (let i = 0; i < this.investors.length; i++) {
      const investor_acct: string = this.investors.keys.get(i) as string;
      const investor = this.investors.get(investor_acct)
      Object.keys(share_breakdowns).forEach((risk_level) => {
        let share_type_str = `${risk_level}_shares`
        let investor_shares = investor[share_type_str]
        let shares_outstanding = this.total_shares_outstanding.get(share_type_str)
        share_breakdowns[risk_level][investor_acct] = investor_shares / Number(shares_outstanding)
      })
    }
    return share_breakdowns
  }

  @call({})
  disburse_profits({}: {}) {
    
    let disbursed = 0;
    let share_breakdowns = this.calculate_share_breakdowns()
    near.log(share_breakdowns)
    for (let i = 0; i < this.invoices.length; i++) {
      const invoice_id: string = this.invoices.keys.get(i) as string;
      const invoice = Object(this.invoices.get(invoice_id))
      let risk_level = invoice.risk_level
      if (invoice.is_paid && !invoice.profits_disbursed) {
        for (const investor_acct in share_breakdowns[risk_level]) {
          let inv_slice_perc = share_breakdowns[risk_level][investor_acct]
          let inv_slice = inv_slice_perc * invoice.invoice_take_rate
          if (investor_acct !== 'contract') {
            near.log(`Paying out ${inv_slice} to ${investor_acct}`)
          }
        }
        disbursed += invoice.invoice_take_rate
        invoice.profits_disbursed = true
        this.invoices.set(invoice_id, invoice)
      }
    }
    if (disbursed > 0) {
      let timestamp = Number(near.blockTimestamp())
      let profit_disbursal = new ProfitDisbursalEntry({timestamp, disbursed})
      near.log("profits dibursed: ", disbursed)      
      this.profit_disbursals.push(profit_disbursal)
    }
  }

  @view({})
  get_profit_disbursals(): Object[] {
    let ret: Object[] = []
    for (let i = 0; i < this.profit_disbursals.length; i++) {
      let _p = Object(this.profit_disbursals[i])
      ret.push(_p)
    }
    return ret
  }

  @view({})
  calculate_risk_level({}) {
    let riskLevels = ["higher_risk", "medium_risk", "lower_risk"]
    let randomRiskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
    return randomRiskLevel
  }

  @call({})
  pay_invoice_receivable({invoice_id}: { invoice_id: string}) {
    let _invoice = Object(this.invoices.get(invoice_id))
    _invoice.is_paid = true
    _invoice.payback_timestamp = Number(near.blockTimestamp())
    this.invoices.set(invoice_id, _invoice)
  }

  @call({})
  submit_invoice_for_payout({ 
    invoicer_acct, 
    invoice_id, 
    invoice_amount, 
    payor_acct, 
    ipfs_link}: { invoicer_acct: string, 
                  invoice_id: string, 
                  invoice_amount: number, 
                  payor_acct: string, 
                  ipfs_link: string}) {
    
    const timestamp = Number(near.blockTimestamp());
    const risk_level = this.calculate_risk_level({});
    const payout_amt = SHARE_INFO[risk_level].payout_perc * invoice_amount;

    const invoice_take_rate = invoice_amount - payout_amt;
    
    let invoice = {
      invoicer_acct: invoicer_acct,
      invoice_id: invoice_id,
      risk_level: risk_level,
      invoice_take_rate: invoice_take_rate,
      is_paid: false,
      profits_disbursed: false,
      payback_timestamp: null,
      invoice_amount: invoice_amount,
      payor_account: payor_acct,
      payout_amt: payout_amt,
      borrowed_timestamp: Number(near.blockTimestamp()),
      ipfs_link: ipfs_link
    }
    this.invoices.set(invoice_id, invoice);
  }

  @view({})
  get_invoices(): Object[] {
    let ret: Object[] = []
    for (let i = 0; i < this.invoices.length; i++) {
      const invoice_id: string = this.invoices.keys.get(i) as string;
      const invoice: Object = this.invoices.get(invoice_id)
      ret.push(invoice)
    }
    return ret
  }

  @call({})
  sell_shares({investor_acct, share_type, quantity}: {investor_acct: string, share_type: string, quantity: number}) {
    
    if (this.investors.get(investor_acct) === null) {
      return null
    }
    else {
      let share_type_str = `${share_type}_shares`
      let inv_obj = this.investors.get(investor_acct)
      const dollarAmount = Number(this.share_prices.get(share_type)) * quantity
      inv_obj[share_type_str] -= quantity
      this.investors.set(investor_acct, inv_obj) 

      let contract_investor = this.investors.get('contract')
      contract_investor[share_type_str] += quantity
      this.investors.set('contract', contract_investor)
      this.total_funds -= dollarAmount

      this.share_txns.push({
        timestamp: Number(near.blockTimestamp()),
        investor_acct: investor_acct,
        share_type: share_type,
        is_buying: false,
        quantity: quantity
      })

    }
  }

  @call({})
  invest_in_contract({ 
    investor_acct, 
    share_type, 
    quantity}: { investor_acct: string, 
                  share_type: string, 
                  quantity: number}) {
    
    const dollarAmount = Number(this.share_prices.get(share_type)) * quantity
    let share_type_str = `${share_type}_shares`
    if (this.investors.get(investor_acct) === null) {
      let inv_obj = {
        investor_acct: investor_acct,
        higher_risk_shares: 0,
        medium_risk_shares: 0,
        lower_risk_shares: 0
      }
      inv_obj[share_type_str] = quantity
      this.investors.set(investor_acct, inv_obj)
    }
    else {
      let inv_obj = this.investors.get(investor_acct)
      inv_obj[share_type_str] += quantity
      this.investors.set(investor_acct, inv_obj)
    }
    this.share_txns.push({
      timestamp: Number(near.blockTimestamp()),
      investor_acct: investor_acct,
      share_type: share_type,
      is_buying: true,
      quantity: quantity
    })
    let contract_investor = this.investors.get('contract')
    contract_investor[share_type_str] -= quantity
    this.investors.set('contract', contract_investor)
    this.total_funds += dollarAmount
  }

  @view({})
  get_investors(): Object[] {
    let ret: Object[] = []
    for (let i = 0; i < this.investors.length; i++) {
      const investor_acct: string = this.investors.keys.get(i) as string;
      const investor: Object = this.get_investor_for_investor_acct({ investor_acct })
      ret.push(investor)
    }
    return ret
  }

  @view({})
  get_share_txns(): Object[] {
    let ret: Object[] = []
    near.log(this.share_txns)
    for (let i = 0; i < this.share_txns.length; i++) {
      near.log(this.share_txns.get(i))
      ret.push(this.share_txns.get(i))
      // ret.push(txn)
    }
    return ret
  }  

  @view({})
  get_investor_for_investor_acct({investor_acct}: { investor_acct: string }): Object {
    return this.investors.get(investor_acct);
  }

  @view({})
  get_all_data_for_frontend({}) {
    let ret_obj = {
      invoices: this.get_invoices(),
      share_txns: this.get_share_txns(),
      investors: this.get_investors(),
      profit_disbursals: this.get_profit_disbursals()
    }
    return ret_obj
  }
}
