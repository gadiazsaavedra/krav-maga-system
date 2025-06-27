import React, { useState } from 'react';
import { 
  Table, TableBody, TableContainer, TableHead, Paper, 
  TablePagination, Box 
} from '@mui/material';

interface PaginatedTableProps {
  children: React.ReactNode;
  data: any[];
  rowsPerPageOptions?: number[];
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({ 
  children, 
  data, 
  rowsPerPageOptions = [10, 25, 50] 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          {React.Children.map(children, (child, index) => {
            if (index === 0) return child; // TableHead
            if (index === 1) {
              return React.cloneElement(child as React.ReactElement, {
                children: React.Children.map((child as React.ReactElement).props.children, (row: any) => {
                  const rowIndex = React.Children.toArray((child as React.ReactElement).props.children).indexOf(row);
                  return rowIndex < paginatedData.length ? React.cloneElement(row, { key: rowIndex }) : null;
                }).filter(Boolean).slice(0, paginatedData.length)
              });
            }
            return child;
          })}
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

export default PaginatedTable;