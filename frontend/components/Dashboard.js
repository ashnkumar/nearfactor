import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableCellPaidBack = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#6ab04c",
    fontSize: 20,
  },
}));

const StyledTableCellNotPaidBack = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#ff7979",
    fontSize: 20,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const INVESTOR_OPTIONS = [
  {
    value: 'investor1',
    label: 'investor1'
  },
  {
    value: 'investor2',
    label: 'investor2'
  },
  {
    value: 'investor3',
    label: 'investor3'
  },
  {
    value: 'investor4',
    label: 'investor4'
  },
  {
    value: 'investor5',
    label: 'investor5'
  }        
]

const RISK_OPTIONS = [
  {
    value: "higher_risk",
    label: "higher_risk"
  },
  {
    value: "medium_risk",
    label: "medium_risk"
  },
  {
    value: "lower_risk",
    label: "lower_risk"
  }
]

const INVESTOR_ACTIONS = [
  {
    value: "buy",
    label: "buy"
  },
  {
    value: "sell",
    label: "sell"
  }
]

const INVOICE_ACCT_OPTIONS = [
  {
    value: "borrower1",
    label: "borrower1"
  },
  {
    value: "borrower2",
    label: "borrower2"
  },
  {
    value: "borrower3",
    label: "borrower3"
  }    
]

const PAYOR_OPTIONS = [
  {
    value: "payor1",
    label: "payor1"
  },
  {
    value: "payor2",
    label: "payor2"
  },
  {
    value: "payor3",
    label: "payor3"
  }    
]

const AGG_VIEW_BASE_DATA = {
  tvl: 0.00,
  financedAmt: 0.00,
  paidOutAmt: 0.00,
  paidBackAmt: 0.00,
  outstandingAmt: 0.00,
  disbursedAmt: 0.00,
  numReceivables: 0,
  numPaidOut: 0,
  numPaidBack: 0,
  numUnpaid: 0
}

const buildTxnArr = (data) => {
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

const InvestorsTable = ({investors}) => {
  
  const [rows, setRows] = useState([])

  useEffect(() => {
    let _rows = createTheRows()
    
    setRows(_rows)
  }, [investors])

  const createTheRows = () => {
    let _rows = []
    investors.forEach((i) => {
      if (i.investor_acct !== 'contract') {
        _rows.push({
          investor_acct: i.investor_acct,
          high_shares: i.higher_risk_shares,
          low_shares: i.lower_risk_shares,
          med_shares: i.medium_risk_shares,
          total_invested: (i.higher_risk_shares * 2.00 + i.medium_risk_shares * 3.00 + i.lower_risk_shares * 1.00)
        })
      }
    })
    return _rows
  }

  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell align="center">Investor Acct</StyledTableCell>
          <StyledTableCell align="center">High-risk shares</StyledTableCell>
          <StyledTableCell align="center">Medium-risk shares</StyledTableCell>
          <StyledTableCell align="center">Low-risk shares</StyledTableCell>
          <StyledTableCell align="center">TVL</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <StyledTableRow key={row.investor_acct}>
            <StyledTableCell component="th" scope="row">
              {row.investor_acct}
            </StyledTableCell>
            <StyledTableCell align="center">{row.high_shares}</StyledTableCell>
            <StyledTableCell align="center">{row.med_shares}</StyledTableCell>
            <StyledTableCell align="center">{row.low_shares}</StyledTableCell>
            <StyledTableCell align="center">{row.total_invested}</StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>   
  )
}

const InvoicesTable = ({invoices}) => {

  const [rows, setRows] = useState([])

  useEffect(() => {
    let _rows = createTheRows()
    
    setRows(_rows)
  }, [invoices])

  const createTheRows = () => {
    let _rows = []
    invoices.forEach((i) => {
      if (i.investor_acct !== 'contract') {
        _rows.push({
          invoicer_acct: i.invoicer_acct,
          invoice_id: i.invoice_id,
          payor_account: i.account,
          payout_amt: i.payout_amt.toFixed(2),
          risk_level: i .risk_level,
          invoice_amount: i.invoice_amount.toFixed(2),
          invoice_take_rate: i.invoice_take_rate.toFixed(2),
          is_paid: i.is_paid

        })
      }
    })
    return _rows
  }

  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell align="center">Invoice ID</StyledTableCell>
          <StyledTableCell align="center">Acct</StyledTableCell>
          <StyledTableCell align="center">Paid Back</StyledTableCell>
          <StyledTableCell align="center">Invoice Amount</StyledTableCell>
          <StyledTableCell align="center">Payout Amount</StyledTableCell>
          <StyledTableCell align="center">Take Rate</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <StyledTableRow key={row.invoice_id}>
            <StyledTableCell component="th" scope="row">
              {row.invoice_id}
            </StyledTableCell>
            <StyledTableCell align="center">{row.invoicer_acct}</StyledTableCell>
            {
              row.is_paid 
              ? <StyledTableCellPaidBack align="center">Yes</StyledTableCellPaidBack>
              : <StyledTableCellNotPaidBack align="center">No</StyledTableCellNotPaidBack>
            }
            <StyledTableCell align="center">{row.invoice_amount}</StyledTableCell>
            <StyledTableCell align="center">{row.payout_amt}</StyledTableCell>
            <StyledTableCell align="center">{row.invoice_take_rate}</StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>    
  )
}

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getData()
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, []);    
  
  useEffect(() => {
    getData()
  }, []);

  const signIn = () => { wallet.signIn() }

  const executeTrade = () => {
    
    if (investorAction === 'buy') {
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
      ipfs_link: "ipfslink"
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
  </div>
  );
};

export default Dashboard;