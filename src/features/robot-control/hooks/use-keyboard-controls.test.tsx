import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RobotController } from '../model/robot-controller';
import { useKeyboardControls } from './use-keyboard-controls';

function KeyboardControlsHarness({
  controller,
  enabled,
}: {
  controller: RobotController;
  enabled: boolean;
}) {
  useKeyboardControls({
    controller,
    enabled,
    onCommand: vi.fn(),
    onError: vi.fn(),
  });
  return null;
}

function createController(): RobotController {
  return {
    backward: vi.fn().mockResolvedValue(undefined),
    forward: vi.fn().mockResolvedValue(undefined),
    left: vi.fn().mockResolvedValue(undefined),
    right: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  };
}

describe('useKeyboardControls', () => {
  it('sends movement on key press and STOP on key release', () => {
    const controller = createController();
    render(<KeyboardControlsHarness controller={controller} enabled />);

    fireEvent.keyDown(window, { key: 'w' });
    fireEvent.keyUp(window, { key: 'w' });

    expect(controller.forward).toHaveBeenCalledOnce();
    expect(controller.stop).toHaveBeenCalledOnce();
  });

  it('supports arrow keys and ignores controls while disconnected', () => {
    const enabledController = createController();
    const { rerender } = render(
      <KeyboardControlsHarness controller={enabledController} enabled />,
    );

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(enabledController.left).toHaveBeenCalledOnce();

    const disabledController = createController();
    rerender(
      <KeyboardControlsHarness
        controller={disabledController}
        enabled={false}
      />,
    );
    fireEvent.keyDown(window, { key: 'ArrowUp' });

    expect(disabledController.forward).not.toHaveBeenCalled();
  });
});
