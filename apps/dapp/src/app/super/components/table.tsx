import { FC, ReactNode } from 'react';

const Row: FC<{ children: ReactNode }> = ({ children }) => {
  return <tr className={`hover:bg-opacity-50`}>{children}</tr>;
};

const CellHeader: FC<{ children: ReactNode }> = ({ children }) => {
  return <th className={`p-2 text-left`}>{children}</th>;
};

const Cell: FC<{ children: ReactNode }> = ({ children }) => {
  return <td className={`px-2 py-4 text-left`}>{children}</td>;
};

const Table = {
  Row,
  CellHeader,
  Cell,
};

export default Table;
