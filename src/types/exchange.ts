export interface ExchangesResponse {
  data: {
    prefix: string;
    count: number;
    exchanges: string[];
  };
}

export interface FlowchartRequest {
  exchange: string;
  filename: string;
}

export interface FlowchartResponse {
  content: string;
  type: 'svg' | 'mmd';
}
