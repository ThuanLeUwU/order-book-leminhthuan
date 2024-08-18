import { useEffect, useState } from "react";

interface TickerData {
  b: string;
  a: string;
  B: string;
  A: string;
}

const getBookTicker = (url: string) => {
  const [result, setResult] = useState<TickerData | null>(null);
  const [prevData, setPrevData] = useState<TickerData | null>(null);
  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const tickerData: TickerData = JSON.parse(event.data);
      setPrevData(result);
      setResult(tickerData);
    };

    socket.onclose = function () {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = function (error) {
      console.error("WebSocket error: ", error);
    };
    return () => {
      socket.close();
    };
  }, [url, result]);

  return { result, prevData };
};

export default getBookTicker;
