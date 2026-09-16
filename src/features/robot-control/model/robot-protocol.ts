import type { RobotCommand } from './robot-command';

const commandPayloads: Record<RobotCommand, string> = {
  backward: 'B',
  forward: 'F',
  left: 'L',
  right: 'R',
  stop: 'S',
};

export function toRobotPayload(command: RobotCommand): string {
  return commandPayloads[command];
}
