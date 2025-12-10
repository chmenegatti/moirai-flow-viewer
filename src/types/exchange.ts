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
  direction?: 'LR' | 'TD';
}

export interface FlowchartResponse {
  content: string;
  type: 'svg' | 'mmd';
}
