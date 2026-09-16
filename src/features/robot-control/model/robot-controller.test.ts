import { describe, expect, it, vi } from 'vitest';
import type { SerialClient } from '../../../types/serial';
import { createRobotController } from './robot-controller';

describe('createRobotController', () => {
  it('sends protocol payloads through the communication abstraction', async () => {
    const client: SerialClient = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      write: vi.fn().mockResolvedValue(undefined),
    };
    const controller = createRobotController(client);

    await controller.forward();
    await controller.stop();

    expect(client.write).toHaveBeenNthCalledWith(1, 'F');
    expect(client.write).toHaveBeenNthCalledWith(2, 'S');
  });
});
