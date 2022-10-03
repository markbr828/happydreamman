import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { formatNumber } from "../../utils/index";
import ModalConnect from '../GeneralComponents/ModalConnect';
import ExchangeCard from './ExchangeCard';
import { useWeb3React } from '@web3-react/core';
import BuySellModal from './BuySellModal';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "black",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function CollapsingRow(props) {
  const { row } = props;
  const [show, setShow] = React.useState(false);
  const { account, active } = useWeb3React();

  return (
    <React.Fragment>
      <StyledTableRow key={row.id} sx={{ '& > *': { borderBottom: 'unset' } }}>

        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="center"><img className='farm-icon' src={row.image} alt=""/></TableCell>
        <TableCell align="center">{formatNumber(parseFloat(row.price_usd))}</TableCell>
        <TableCell align="center">{formatNumber(parseFloat(row.market_cap))}</TableCell>
        <TableCell align="center">
          {row.components.map((item) => (
          <img className='farm-icon' src={item.image} alt={""}/>))}
        </TableCell>
        {/* <TableCell align="right">${formatNumber(row.liquidity)}</TableCell> */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setShow(!show)}
          >
            <ShoppingCartIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
      <BuySellModal show1={show} setShow1={setShow} token={row}/>
     
    </React.Fragment>
  );
}

export default CollapsingRow;