"use client";

import { useState } from "react";

type TrendData = {
  trend1: string;
  trend2: string;
  trend3: string;
  trend4: string;
  trend5: string;
  end_time: string;
  ip_address: string;
};

export default function Home() {
  const [result, setResult] = useState<TrendData | null>(null);

  const fetchTrends = async () => {
    const res = await fetch("/api/run-script");
    if (res.ok) {
      const data: TrendData = await res.json();
      setResult(data);
    } else {
      console.error("Failed to fetch trends");
    }
  };

  return (
    <div>
      <button onClick={fetchTrends}>Click here to run the script</button>
      {result && (
        <div>
          <p>
            These are the most happening topics as on{" "}
            {new Date(result.end_time).toLocaleString()}
          </p>
          <ul>
            <li>{result.trend1}</li>
            <li>{result.trend2}</li>
            <li>{result.trend3}</li>
            <li>{result.trend4}</li>
            <li>{result.trend5}</li>
          </ul>
          <p>The IP address used for this query was {result.ip_address}.</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
