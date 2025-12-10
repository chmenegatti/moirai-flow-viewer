import { ExchangesResponse, FlowchartRequest } from "@/types/exchange";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || false;

// Mock data
const mockExchanges: ExchangesResponse = {
  data: {
    prefix: "moirai",
    count: 24,
    exchanges: [
      "moirai.topic.database.clone",
      "moirai.topic.database.create",
      "moirai.topic.database.delete",
      "moirai.topic.database.export",
      "moirai.topic.database.import",
      "moirai.topic.database.share",
      "moirai.topic.database.static.rule",
      "moirai.topic.sdnvpn.create",
      "moirai.topic.sdnvpn.delete",
      "moirai.topic.sdnvpn.update",
      "moirai.topic.network.provision",
      "moirai.topic.network.deprovision",
      "moirai.topic.firewall.create",
      "moirai.topic.firewall.delete",
      "moirai.topic.firewall.update",
      "moirai.topic.loadbalancer.create",
      "moirai.topic.loadbalancer.delete",
      "moirai.topic.dns.create",
      "moirai.topic.dns.update",
      "moirai.topic.dns.delete",
      "moirai.topic.certificate.issue",
      "moirai.topic.certificate.renew",
      "moirai.topic.certificate.revoke",
      "moirai.topic.monitoring.alert",
    ],
  },
};

const mockMermaidFlowchart = `flowchart TD
    A[📨 Message Received] --> B{Validate Request}
    B -->|Valid| C[🔐 Authentication]
    B -->|Invalid| Z[❌ Return Error]
    C -->|Success| D[📋 Parse Payload]
    C -->|Failed| Z
    D --> E{Check Operation Type}
    E -->|CREATE| F[🆕 Create Resource]
    E -->|UPDATE| G[✏️ Update Resource]
    E -->|DELETE| H[🗑️ Delete Resource]
    F --> I[💾 Save to Database]
    G --> I
    H --> J[🧹 Cleanup Resources]
    J --> I
    I --> K{Notify Services}
    K -->|Async| L[📡 Publish Event]
    K -->|Sync| M[⏳ Wait for Response]
    L --> N[✅ Return Success]
    M --> N
    
    style A fill:#A6E22E,stroke:#A6E22E,color:#272822
    style N fill:#A6E22E,stroke:#A6E22E,color:#272822
    style Z fill:#F92672,stroke:#F92672,color:#F8F8F2
    style C fill:#66D9EF,stroke:#66D9EF,color:#272822
    style I fill:#FD971F,stroke:#FD971F,color:#272822`;

export async function fetchExchanges(): Promise<ExchangesResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockExchanges;
  }

  const response = await fetch(`${API_BASE}/exchanges`);
  if (!response.ok) {
    throw new Error("Failed to fetch exchanges");
  }
  return response.json();
}

export async function fetchFlowchart(exchange: string, direction: 'LR' | 'TD' = 'LR'): Promise<string> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return mock mermaid diagram with exchange name
    return mockMermaidFlowchart.replace("Message Received", `${exchange.split('.').pop()?.toUpperCase() || 'MESSAGE'}`);
  }

  // Sanitize filename to match backend validation (only letters, numbers, underscores, hyphens)
  const sanitizedFilename = exchange.replace(/[^a-zA-Z0-9_-]/g, '_');

  const body: FlowchartRequest = {
    exchange,
    filename: sanitizedFilename,
    direction,
  };

  const response = await fetch(`${API_BASE}/flowchart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/vnd.mermaid, text/plain",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch flowchart");
  }

  const contentType = response.headers.get("content-type");

  // Return Mermaid code as text
  if (contentType?.includes("text/plain") || contentType?.includes("text/vnd.mermaid")) {
    return response.text();
  }

  // Fallback: try to get from JSON response
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to generate flowchart");
  }

  throw new Error("Unexpected response format from API");
}