import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RobotController } from '../model/robot-controller';
import { RobotControls } from './robot-controls';

function createController(): RobotController {
  return {
    backward: vi.fn().mockResolvedValue(undefined),
    forward: vi.fn().mockResolvedValue(undefined),
    left: vi.fn().mockResolvedValue(undefined),
    right: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  };
}

describe('RobotControls', () => {
  it('stops after releasing a movement button', () => {
    const controller = createController();
    render(<RobotControls controller={controller} enabled />);

    const forwardButton = screen.getByRole('button', { name: 'Forward' });
    fireEvent.pointerDown(forwardButton);
    fireEvent.pointerUp(forwardButton);

    expect(controller.forward).toHaveBeenCalledOnce();
    expect(controller.stop).toHaveBeenCalledOnce();
  });
});
