import React, { useState, useEffect } from 'react';
import Select from 'react-select'

import {
  INVESTOR_OPTIONS,
  RISK_OPTIONS,
  INVESTOR_ACTIONS,
  INVOICE_ACCT_OPTIONS,
  PAYOR_OPTIONS,
  AGG_VIEW_BASE_DATA
} from '../consts.js'

import {
  buildTxnArr,
  getRandomInt
} from '../utils.js'

const Dashboard = ({ isSignedIn, nearFactor, wallet }) => {

  // Investors
  const [investor, setInvestor] = useState('investor1')
  const [investorRiskLevel, setInvestorRiskLevel] = useState('higher_level')
  const [investorAction, setInvestorAction] = useState('buy')
  const [investorQuantity, setInvestorQuantity] = useState(10)

  // Invoices
  const [invoiceAcct, setInvoiceAcct] = useState('borrower1')
  const [invoiceAmount, setInvoiceAmount] = useState(100)
  const [payorAcct, setPayorAcct] = useState('payor1')
  const [invoiceIDOptions, setInvoiceIDOptions] = useState([])
  const [payInvoiceID, setPayInvoiceID] = useState('invoiceID1')

  // View data
  const [aggViewData, setAggViewData] = useState(AGG_VIEW_BASE_DATA)
  const [allTxns, setAllTxns] = useState([])
  const [investors, setInvestors] = useState([])
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      getData()
    }, 500);
    return () => clearInterval(interval);
  }, []);    
  
  useEffect(() => {
    getData()
  }, []);

  const signIn = () => { wallet.signIn() }

  const executeTrade = () => {
    
    if (investorAction === 'buy') {
      console.log("Buying ...")
      console.log(investor, investorRiskLevel, investorAction, investorQuantity)
      nearFactor.investInContract(investor, investorRiskLevel, parseInt(investorQuantity))
    }
  }

  const investInContract = () => {
    nearFactor.investInContract('inv123', 'higher_risk', 40)
  }

  const sellShares = () => {
    nearFactor.investInContract('inv123', 'higher_risk', 40)
  }
  
  const submitInvoice = () => {
    nearFactor.submitInvoice({
      invoice_id: `invoiceID${getRandomInt(999)}`,
      invoicer_acct: invoiceAcct,
      invoice_amount: parseInt(invoiceAmount),
      payor_acct: payorAcct,
      ipfs_link: "fakeipfslink"
    })
  }
  
  const payInvoice = () => {
    nearFactor.payInvoice({
      invoice_id: payInvoiceID
    })
  }
  
  const disburseProfits = () => {
    nearFactor.disburseProfits({
    })
  }  

  const getData = async () => {
    const data = await nearFactor.getAllDataForFrontend()
    const invoiceIds = data.invoices.map((i) => ({value: i.invoice_id, label: i.invoice_id}))
    setInvoiceIDOptions(invoiceIds)
    setInvestors(data.investors)
    setInvoices(data.invoices)
    
    // Contract agg stuff
    let tvl = 0.00
    let financedAmt = 0.00
    let paidOutAmt = 0.00
    let paidBackAmt = 0.00
    let unpaidAmt = 0.00
    let profitsDisbursed = 0.00
    let numReceivables = 0
    let numPaidOut = 0
    let numPaidBack = 0
    let numOutstanding = 0

    data.invoices.forEach((inv) => {
      financedAmt += inv.invoice_amount
      paidOutAmt += inv.payout_amt
      paidBackAmt += inv.is_paid ? inv.invoice_amount : 0
      profitsDisbursed += inv.profits_disbursed ? inv.invoice_take_rate : 0
      numReceivables += 1
      numPaidOut += 1
      numPaidBack += inv.is_paid ? 1 : 0
      numOutstanding += inv.is_paid ? 0 : 1
    })

    data.investors.forEach((i) => {
      if (i.investor_acct !== 'contract') {
        tvl += i.higher_risk_shares * 2.00
        tvl += i.medium_risk_shares * 3.00
        tvl += i.lower_risk_shares * 1.00
      }
    })
    let aggObj = {
      tvl: tvl,
      financedAmt: financedAmt,
      paidOutAmt: paidOutAmt,
      paidBackAmt: paidBackAmt,
      outstandingAmt: financedAmt - paidBackAmt,
      disbursedAmt: profitsDisbursed,
      numReceivables: numReceivables,
      numPaidOut: numPaidOut,
      numPaidBack: numPaidBack,
      numUnpaid: numOutstanding      
    }
    setAggViewData(aggObj)
    setAllTxns(buildTxnArr(data))
  }

  

  const signOut = () => { wallet.signOut() }

  return (
    <div className="maindiv2">
    <div className="leftdiv">
      <div className="logodiv">
        <div className="logo">
        </div>
      </div>
      <div className="actionsidv info">
        <div className="actiondivtitlediv">
          <div className="actiondivtitletex"><strong className="boldtext">Smart Contract Info</strong></div>
        </div>
        <div className="contractdivtext">
          <div className="leftcontract">
            <div className="contractdivinnertextdiv">
              <div className="contractdivtextbold">TVL: {aggViewData.tvl} NEAR</div>
              <div className="contractdivtextbold">Financed: {aggViewData.financedAmt} NEAR</div>
              <div className="contractdivtextbold">Paid Out: {aggViewData.paidOutAmt} NEAR</div>
              <div className="contractdivtextbold">Paid Back: {aggViewData.paidBackAmt} NEAR</div>
              <div className="contractdivtextbold">Unpaid: {aggViewData.outstandingAmt} NEAR</div>
            </div>
          </div>
          <div className="leftcontract">
            <div className="contractdivtextbold">Profits Disbursed: {aggViewData.disbursedAmt} NEAR</div>
            <div className="contractdivtextbold"># Receivables: {aggViewData.numReceivables}</div>
            <div className="contractdivtextbold"># Paid Out: {aggViewData.numPaidOut}</div>
            <div className="contractdivtextbold"># Paid Back: {aggViewData.numPaidBack}</div>
            <div className="contractdivtextbold"># Unpaid: {aggViewData.numUnpaid}</div>
          </div>
        </div>
        <div onClick={disburseProfits} className="submitbuttondiv">
          <div className="buttontext">DISBURSE PROFITS</div>
        </div>
      </div>
      <div className="middleactiondiv">
        <div className="actionsidv small">
          <div className="actiondivtitlediv">
            <div className="actiondivtitletex"><strong className="boldtextsmall">Invest</strong></div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Investor</div>
            </div>
            <div className="inputdropdown">
              <Select 
                options={INVESTOR_OPTIONS} 
                onChange={(f) => setInvestor(f.value)}
                />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Risk</div>
            </div>
            <div className="inputdropdown">
            <Select 
                options={RISK_OPTIONS} 
                onChange={(f) => setInvestorRiskLevel(f.value)}
                />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Action</div>
            </div>
            <div className="inputdropdown">
            <Select 
                options={INVESTOR_ACTIONS} 
                onChange={(f) => setInvestorAction(f.value)}
                />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Quantity</div>
            </div>
            <div className="inputdropdown">
            <input type="number" value={investorQuantity} onChange={(e) => setInvestorQuantity(e.target.value)} />
            </div>
          </div>
          <div className="submitbuttondiv form">
            <div className="buttontext" onClick={() => executeTrade()}>
              EXECUTE
            </div>
          </div>
        </div>
        <div className="actionsidv small">
          <div className="actiondivtitlediv">
            <div className="actiondivtitletex"><strong>Submit Invoice</strong></div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Account</div>
            </div>
            <div className="inputdropdown">
            <Select 
                options={INVOICE_ACCT_OPTIONS} 
                onChange={(f) => setInvoiceAcct(f.value)}
                />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Amount</div>
            </div>
            <div className="inputdropdown">
            <input type="number" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Payor</div>
            </div>
            <div className="inputdropdown">
            <Select 
                options={PAYOR_OPTIONS} 
                onChange={(f) => setPayorAcct(f.value)}
                />
            </div>
          </div>
          <div className="forminputdivd">
            <div className="forminputlabeltext">
              <div className="forminoutlabeltextt">Image</div>
            </div>
            <div className="inputdropdown upload">
              <div className="uploadtext"><strong>UPLOAD</strong></div>
            </div>
          </div>
          <div className="submitbuttondiv form">
            <div className="buttontext" onClick={() => submitInvoice()}>
              SUBMIT
            </div>
          </div>
        </div>
      </div>
      <div className="middleactiondiv receiable">
        <div className="actionsidv small receievable">
          <div className="actiondivtitlediv">
            <div className="actiondivtitletex">Pay Receivable</div>
          </div>
          <div className="forminputdivd redec">
            <div className="forminputlabeltext receifable">
              <div className="forminoutlabeltextt">Invoice</div>
            </div>
            <div className="inputdropdown receivable">
              <Select 
                options={invoiceIDOptions} 
                onChange={(f) => setPayInvoiceID(f.value)}
                />
            </div>
            <div className="submitbuttondiv form receivable">
              <div onClick={() => payInvoice()} className="buttontext">Pay Invoice</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="centerdiv">
      <div className="ledgertitledevi">
        <div className="ledgertitletext">Balance Sheet (Ledger)</div>
      </div>
      <div className="tablesdiv">
        <div className="investortablediv">
          <div className="investorsheaderdivthing">
            <div className="actiondivtitlediv">
              <div className="actiondivtitletex"><strong className="boldtext">Investors</strong></div>
            </div>
            <InvestorsTable investors={investors}/>
          </div>
        </div>
        <div className="investortablediv factored">
          <div className="actiondivtitlediv">
            <div className="actiondivtitletex"><strong>Factored Invoices</strong></div>
          </div>
          <InvoicesTable invoices={invoices} />
        </div>
      </div>
    </div>
    <TxnsDisplay allTxns={allTxns} />
  </div>
  );
};

export default Dashboard;