export interface Smartboard {
  id: number;
  board_id: string;
  classroom: string;
  ip_address?: string;
  status: 'online' | 'offline' | 'broadcasting' | 'warning';
  last_seen: string;
}

export interface BroadcastSession {
  id: number;
  title: string;
  content_type: string;
  start_time: string;
  end_time?: string;
  status: string;
  successful_deliveries: number;
  failed_deliveries: number;
}
