import { ExchangesResponse, FlowchartRequest } from "@/types/exchange";

const API_BASE = "/api";

export async function fetchExchanges(): Promise<ExchangesResponse> {
  const response = await fetch(`${API_BASE}/exchanges`);
  if (!response.ok) {
    throw new Error("Failed to fetch exchanges");
  }
  return response.json();
}

export async function fetchFlowchart(exchange: string): Promise<string> {
  const body: FlowchartRequest = {
    exchange,
    filename: exchange,
  };

  const response = await fetch(`${API_BASE}/flowchart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch flowchart");
  }

  // Check content type to determine response format
  const contentType = response.headers.get("content-type");
  
  if (contentType?.includes("image/svg+xml")) {
    return response.text();
  }
  
  // For JSON response containing SVG or mermaid content
  const data = await response.json();
  return data.content || data;
}
