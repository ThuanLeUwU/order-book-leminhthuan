"use client";

import { Button } from "@mui/material";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToWebSocketOrderBook = () => {
    router.push("/coin-tracking");
  };

  const goToRestApiOrderBook = () => {
    router.push("/rest-api");
  };
  const goToBookTicker = () => {
    router.push("/diff-depth");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="flex gap-4">
        <Button
          onClick={goToWebSocketOrderBook}
          className="relative bg-[#1d4ed8] text-white py-2 px-4 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:animate-rainbow-border">
          Order Book by WebSocket Stream
          <span className="absolute inset-0 border-2 border-transparent rounded-lg"></span>
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={goToBookTicker}
          sx={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(94deg, #2196F3, #2196F3)",
            color: "white",
            transition: "background 0.3s ease",
            "&:hover": {
              background: "linear-gradient(94deg, #2196F3, #9C27B0)",
              color: "black",
            },
          }}>
          Book Ticker by Currency
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={goToRestApiOrderBook}>
          Order Book by REST API
        </Button>
      </div>
    </main>
  );
}
