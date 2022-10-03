import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CollapsingRow from './CollapsingRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { NONAME } from 'dns';


function IndexesTable(props: any) {

  const { rows } = props;
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState<any>("asc");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (filterValue === "") {
      setFilteredData(rows)
    }
  }, [props]);

  useEffect(() => {
    if (filterValue !== "") {
      const filteredIndex: any = [];
      rows.map((item: any) => {
        let tokenName = item.name.toLowerCase();
        if (tokenName.includes(filterValue.toLowerCase())) {
          filteredIndex.push(item);
        }
      })
      setFilteredData(filteredIndex)
      setPage(0)
    } else {
      setFilteredData(rows)
    }
  }, [filterValue]);
  // console.log("LENGTH:", filteredData);
  // console.log("PAGE:", page);
  // console.log("ROWS:", rowsPerPage);

  const sortingbyname = () => {
    if (sortBy === "asc") {
      filteredData.sort((a: any, b: any) => (a.name > b.name) ? -1 : 1);
      setFilteredData([...filteredData]);
      setSortBy("dec");
    }
    else {
      filteredData.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1);
      setFilteredData([...filteredData]);
      setSortBy("asc");
    }
  }

  const sortingbyprovider = () => {
    if (sortBy === "asc") {
      filteredData.sort((a: any, b: any) => (a.provider > b.provider) ? -1 : 1);
      setFilteredData([...filteredData]);
      setSortBy("dec");
    }
    else {
      filteredData.sort((a: any, b: any) => (a.provider > b.provider) ? 1 : -1);
      setFilteredData([...filteredData]);
      setSortBy("asc");
    }
  }

  const sortingbyprice = () => {
    if (sortBy === "asc") {
      filteredData.sort((a: any, b: any) => (parseFloat(a.price_usd) > parseFloat(b.price_usd)) ? -1 : 1);
      setFilteredData([...filteredData]);
      setSortBy("dec");
    }
    else {
      filteredData.sort((a: any, b: any) => (parseFloat(a.price_usd) > parseFloat(b.price_usd)) ? 1 : -1);
      setFilteredData([...filteredData]);
      setSortBy("asc");
    }
  }

  const sortingbycap = () => {
    if (sortBy === "asc") {
      filteredData.sort((a: any, b: any) => (parseFloat(a.market_cap) > parseFloat(b.market_cap)) ? -1 : 1);
      setFilteredData([...filteredData]);
      setSortBy("dec");
    }
    else {
      filteredData.sort((a: any, b: any) => (parseFloat(a.market_cap) > parseFloat(b.market_cap)) ? 1 : -1);
      setFilteredData([...filteredData]);
      setSortBy("asc");
    }
  }

  const html = (
    <>
      {props.availableSearch && 
        <TextField 
          id="outlined-basic" 
          style={{
            marginBottom: 15,
            borderColor: '#ffffff',
            color: '#ffffff'
          }} 
          label="Filter Token" 
          variant="outlined" 
          onChange={(e) => setFilterValue(e.target.value)} 
          value={filterValue} 
          // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
      />}

      <TableContainer component={Paper}>
        <Table className="table-striped table-dark collapse-table" aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell onClick={() => sortingbyname()}>Name <img src="/assets/icons/sort/sort1.png" width="18px" alt="" /></TableCell>
              <TableCell onClick={() => sortingbyprovider()} align="center">Provider <img src="/assets/icons/sort/sort1.png" width="18px" alt="" /></TableCell>
              <TableCell onClick={() => sortingbyprice()} align="center">Price <img src="/assets/icons/sort/sort1.png" width="18px" alt="" /></TableCell>
              <TableCell onClick={() => sortingbycap()} align="center">Marketcap <img src="/assets/icons/sort/sort1.png" width="18px" alt="" /></TableCell>
              <TableCell align="center" className='cl-apr'>Asset coins <img src="/assets/icons/sort/sort1.png" width="18px" alt="" /></TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, i: any) => (
              <CollapsingRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>)

  return html;

}

export default IndexesTable;