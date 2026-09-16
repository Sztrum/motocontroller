import { describe, expect, it } from 'vitest';
import { toRobotPayload } from './robot-protocol';

describe('toRobotPayload', () => {
  it.each([
    ['forward', 'F'],
    ['backward', 'B'],
    ['left', 'L'],
    ['right', 'R'],
    ['stop', 'S'],
  ] as const)('maps %s to %s', (command, payload) => {
    expect(toRobotPayload(command)).toBe(payload);
  });
});
