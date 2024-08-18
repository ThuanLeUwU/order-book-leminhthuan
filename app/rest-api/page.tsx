"use client";

import React, { useEffect, useState } from "react";
import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import OrderTable from "@/components/orderTable";
import { useRouter } from "next/navigation";

interface DepthData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

const RESTApiClient: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DepthData | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("btcusdt");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [depth, setDepth] = useState<string>("20");

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(
        JSON.stringify({ symbol: selectedCurrency.toUpperCase(), limit: depth })
      );
    };

    socket.onmessage = (event) => {
      const parsedData: DepthData = JSON.parse(event.data);
      setData(parsedData);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      socket.close(); // Đóng kết nối khi component bị unmount
    };
  }, [selectedCurrency, depth]);

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

  const goToHome = () => {
    router.push("/");
  };
  if (!data) {
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
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
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
            <OrderTable title="Buy Order" data={data.bids} name={keyname} />
          </div>
          <div className="flex-1 overflow-x-auto">
            <OrderTable title="Sell Order" data={data.asks} name={keyname} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RESTApiClient;
