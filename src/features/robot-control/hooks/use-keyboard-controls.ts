import { useEffect } from 'react';
import type { RobotController } from '../model/robot-controller';
import type { RobotCommand } from '../model/robot-command';

type Movement = 'forward' | 'backward' | 'left' | 'right';

const keyToMovement: Record<string, Movement | undefined> = {
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'forward',
  a: 'left',
  d: 'right',
  s: 'backward',
  w: 'forward',
};

interface UseKeyboardControlsOptions {
  controller: RobotController;
  enabled: boolean;
  onError: (error: unknown) => void;
  onCommand: (command: RobotCommand) => void;
}

export function useKeyboardControls({
  controller,
  enabled,
  onError,
  onCommand,
}: UseKeyboardControlsOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const activeKeys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      const movement =
        keyToMovement[event.key.toLowerCase()] ?? keyToMovement[event.key];

      if (!movement || activeKeys.has(event.key)) {
        return;
      }

      event.preventDefault();
      activeKeys.add(event.key);
      onCommand(movement);
      void controller[movement]().catch(onError);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!activeKeys.delete(event.key)) {
        return;
      }

      event.preventDefault();
      onCommand('stop');
      void controller.stop().catch(onError);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      activeKeys.clear();
    };
  }, [controller, enabled, onCommand, onError]);
}
