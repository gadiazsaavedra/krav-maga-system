import React from 'react';
import { TableRow } from '@mui/material';

interface AlumnoTableRowProps {
  children: React.ReactNode;
  isHeader?: boolean;
}

const AlumnoTableRow: React.FC<AlumnoTableRowProps> = React.memo(({ children, isHeader = false }) => {
  return (
    <TableRow
      sx={{
        backgroundColor: isHeader ? '#e3f2fd' : 'inherit',
        '&:hover': {
          backgroundColor: isHeader ? '#e3f2fd' : '#f5f5f5',
        }
      }}
    >
      {children}
    </TableRow>
  );
});

export default AlumnoTableRow;