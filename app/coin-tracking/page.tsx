"use client";
import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import OrderTable from "@/components/orderTable";
import useWebSocket from "@/utils/websocketCilent";
import { useRouter } from "next/navigation";

export default function Tracking() {
  const router = useRouter();
  const [depth, setDepth] = useState<string>("10");

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
  const getKeynameBySymbol = (symbol: string) => {
    const currencyData = currency.find((item) => item.symbol === symbol);
    return currencyData ? currencyData.keyname : "";
  };

  const keyname = getKeynameBySymbol(selectedCurrency.toLowerCase());
  const depthData = useWebSocket(
    `wss://stream.binance.com:9443/ws/${selectedCurrency}@depth${depth}@1000ms`
  );

  const goToHome = () => {
    router.push("/");
  };
  if (!depthData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex min-h-screen flex-col justify-between p-24 gap-10">
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
              Order Book - {selectedCurrencyType}
            </Typography>{" "}
            {/* Thay thế bằng tên trang hiện tại */}
          </Breadcrumbs>
        </p>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <FormControl variant="outlined" size="small">
              <InputLabel id="select-1-label">Depth</InputLabel>
              <Select
                labelId="select-1-label"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                label="Depth">
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>
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
        <div className="flex flex-col gap-4 xl:flex-row xl:gap-10">
          <div className="flex-1 overflow-x-auto">
            <OrderTable
              title="Buy Order"
              data={depthData.bids}
              name={keyname}
            />
          </div>
          <div className="flex-1 overflow-x-auto">
            <OrderTable
              title="Sell Order"
              data={depthData.asks}
              name={keyname}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
