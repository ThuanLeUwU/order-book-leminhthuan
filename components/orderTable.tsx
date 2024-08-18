import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

interface OrderTableProps {
  title: string;
  data: any;
  name: any;
}

const OrderTable: React.FC<OrderTableProps> = ({ title, data, name }) => {
  const calculateTotal = (price: string, quantity: string): number => {
    return parseFloat(price) * parseFloat(quantity);
  };

  const calculateSum = (items: [string, string][]) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    let totalSum = 0;
    return items.map(([price, quantity], index) => {
      const total = calculateTotal(price, quantity);
      totalSum += total;
      return [price, quantity, total, totalSum] as [
        string,
        string,
        number,
        number
      ];
    });
  };

  const formatPrice = (price: string): string => {
    if (name === "BNB") {
      return parseFloat(price).toFixed(6);
    } else {
      return parseFloat(price).toFixed(2);
    }
  };
  const formatQuantity = (quantity: string): string =>
    parseFloat(quantity).toFixed(5);

  const formattedData = calculateSum(data);

  return (
    <TableContainer
      component={Paper}
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        overflow: "hidden",
        flex: 1,
      }}>
      <Typography variant="h6" component="div" style={{ padding: 16 }}>
        {title}
      </Typography>
      <Table
        style={{
          borderCollapse: "collapse",
        }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontSize: "12px", fontWeight: "100" }}>
              Price (USDT)
            </TableCell>
            <TableCell style={{ fontSize: "12px", fontWeight: "100" }}>
              Amount ({name})
            </TableCell>
            <TableCell style={{ fontSize: "12px", fontWeight: "100" }}>
              Total (USDT)
            </TableCell>
            <TableCell style={{ fontSize: "12px", fontWeight: "100" }}>
              Sum (USDT)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formattedData.map(([price, quantity, total, sum], index) => (
            <TableRow
              key={index}
              style={{
                border: "1px solid #ddd",
                transition: "background-color 0.3s, font-weight 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.fontWeight = "bold";
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.fontWeight = "normal";
                e.currentTarget.style.backgroundColor = "transparent";
              }}>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "100",
                  cursor: "default",
                }}>
                {formatPrice(price)}
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "100",
                  cursor: "default",
                }}>
                {formatQuantity(quantity)}
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "100",
                  cursor: "default",
                }}>
                {total.toFixed(7)}
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "100",
                  cursor: "default",
                }}>
                {sum.toFixed(7)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // </div>
    // </div>
  );
};

export default OrderTable;
