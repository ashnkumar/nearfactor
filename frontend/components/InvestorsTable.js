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

export default InvestorsTable;