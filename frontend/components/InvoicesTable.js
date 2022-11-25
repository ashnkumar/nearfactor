import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

export default InvoicesTable;