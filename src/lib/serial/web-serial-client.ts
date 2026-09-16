import { serialConfig } from '../../config/serial';
import type { SerialClient } from '../../types/serial';

interface WebSerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream<Uint8Array> | null;
}

interface WebSerialApi {
  requestPort(): Promise<WebSerialPort>;
}

type SerialNavigator = Navigator & { serial?: WebSerialApi };

export class WebSerialClient implements SerialClient {
  private port: WebSerialPort | null = null;

  async connect(): Promise<void> {
    const serial = (navigator as SerialNavigator).serial;

    if (!serial) {
      throw new Error('Web Serial API is not supported by this browser.');
    }

    const port = await serial.requestPort();
    await port.open({ baudRate: serialConfig.baudRate });
    this.port = port;
  }

  async disconnect(): Promise<void> {
    if (!this.port) {
      return;
    }

    await this.port.close();
    this.port = null;
  }

  async write(data: string): Promise<void> {
    if (!this.port?.writable) {
      throw new Error('No serial connection is available.');
    }

    const writer = this.port.writable.getWriter();

    try {
      await writer.write(new TextEncoder().encode(data));
    } finally {
      writer.releaseLock();
    }
  }
}
