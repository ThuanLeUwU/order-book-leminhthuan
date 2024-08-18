"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import getBookTicker from "@/utils/apiClient";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DiffDepth() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("btcusdt");

  const currency = [
    {
      keyname: "BTC",
      type: "BTC/USDT",
      symbol: "btcusdt",
    },
    { keyname: "ETH", type: "ETH/USDT", symbol: "ethusdt" },
    {
      keyname: "BNB",
      type: "BNB/BTC",
      symbol: "bnbbtc",
    },
  ];
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value);
  };
  const selectedCurrencyType =
    currency.find((c) => c.symbol === selectedCurrency)?.type || "";

  const { result: tickerData, prevData } = getBookTicker(
    `wss://stream.binance.com:9443/ws/${selectedCurrency}@bookTicker`
  );

  if (!tickerData) {
    return <div>Loading...</div>;
  }
  const bid = parseFloat(tickerData.b);
  const ask = parseFloat(tickerData.a);
  const spread = ask - bid;
  const qtyBid = parseFloat(tickerData.B);
  const qtyAsk = parseFloat(tickerData.A);

  const prevBid = prevData ? parseFloat(prevData.b) : bid;
  const prevAsk = prevData ? parseFloat(prevData.a) : ask;
  const prevSpread = prevAsk - prevBid;

  const getArrowDirection = (current: number, previous: number) => {
    return current > previous ? "up" : "down";
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col p-24 gap-10">
      <div className="z-10 w-full flex justify-between items-center font-mono text-sm p-4">
        <p className="left-0 top-0 flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              onClick={goToHome}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              Home
            </Link>
            <Typography color="text.primary">
              Book Ticker - {selectedCurrencyType}
            </Typography>{" "}
            {/* Thay thế bằng tên trang hiện tại */}
          </Breadcrumbs>
        </p>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <FormControl variant="outlined" size="small">
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={selectedCurrency}
                onChange={handleChange}
                label="Select Currency">
                {currency.map((item) => (
                  <MenuItem key={item.symbol} value={item.symbol}>
                    {item.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="p-4">
        <TableContainer component={Paper}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            style={{ padding: "16px" }}>
            Difference - {selectedCurrencyType}
          </Typography>
          <Table aria-label="spread table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Highest Bid
                </TableCell>
                <TableCell align="right">
                  {bid !== null ? bid.toFixed(5) : "Loading..."}
                  {getArrowDirection(bid, prevBid) === "up" ? (
                    <ArrowUpward color="success" />
                  ) : (
                    <ArrowDownward color="error" />
                  )}
                </TableCell>
                <TableCell align="right">{qtyBid.toFixed(6)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Lowest Ask
                </TableCell>
                <TableCell align="right">
                  {ask !== null ? ask.toFixed(5) : "Loading..."}
                  {getArrowDirection(ask, prevAsk) === "up" ? (
                    <ArrowUpward color="success" />
                  ) : (
                    <ArrowDownward color="error" />
                  )}
                </TableCell>
                <TableCell align="right">{qtyAsk.toFixed(6)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ fontWeight: "bold" }}>
                  Spread
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  {spread !== null ? spread : "Loading..."}
                  {getArrowDirection(spread, prevSpread) === "up" ? (
                    <ArrowUpward color="success" />
                  ) : (
                    <ArrowDownward color="error" />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
