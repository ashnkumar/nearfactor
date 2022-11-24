/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { utils } from 'near-api-js';

export class NearFactor {

  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse
  }

  async investInContract(investor_acct, share_type, quantity) {
    await this.wallet.callMethod({ contractId: this.contractId, method: "invest_in_contract", args: { 
      investor_acct: investor_acct,
      share_type: share_type,
      quantity: parseInt(quantity)
    }})
  }

  async submitInvoice({invoicer_acct, invoice_id, invoice_amount, payor_acct, ipfs_link}) {
    let _obj = { 
        invoicer_acct: invoicer_acct,
        invoice_id: invoice_id,
        invoice_amount: invoice_amount,
        payor_acct: payor_acct,
        ipfs_link: ipfs_link
    }

    await this.wallet.callMethod({ contractId: this.contractId, method: "submit_invoice_for_payout", args: _obj})
    
  }

  async payInvoice({invoice_id}) {
    await this.wallet.callMethod({ contractId: this.contractId, method: "pay_invoice_receivable", args: { 
      invoice_id: invoice_id
    }})
  }

  async disburseProfits() {
    await this.wallet.callMethod({ contractId: this.contractId, method: "disburse_profits", args: { 
    }})    
  }

  async getInvoices() {
    const invoices = await this.wallet.viewMethod({ contractId: this.contractId, method: "get_invoices" })
    return invoices
  }

  async getProfitDisbursals() {
    const profit_disbursals = await this.wallet.viewMethod({ contractId: this.contractId, method: "get_profit_disbursals" })
    return profit_disbursals
  }  

  async getAllDataForFrontend() {
    const frontendData = await this.wallet.viewMethod({ contractId: this.contractId, method: "get_all_data_for_frontend" })
    return frontendData
  }    

}