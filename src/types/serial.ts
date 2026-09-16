export interface SerialClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  write(data: string): Promise<void>;
}
