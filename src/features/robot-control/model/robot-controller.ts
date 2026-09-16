import type { SerialClient } from '../../../types/serial';
import type { RobotCommand } from './robot-command';
import { toRobotPayload } from './robot-protocol';

export interface RobotController {
  backward(): Promise<void>;
  forward(): Promise<void>;
  left(): Promise<void>;
  right(): Promise<void>;
  stop(): Promise<void>;
}

export function createRobotController(client: SerialClient): RobotController {
  const send = (command: RobotCommand) => client.write(toRobotPayload(command));

  return {
    backward: () => send('backward'),
    forward: () => send('forward'),
    left: () => send('left'),
    right: () => send('right'),
    stop: () => send('stop'),
  };
}
