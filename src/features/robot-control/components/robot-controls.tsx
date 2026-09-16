import { useCallback, useState } from 'react';
import { useKeyboardControls } from '../hooks/use-keyboard-controls';
import type { RobotCommand } from '../model/robot-command';
import type { RobotController } from '../model/robot-controller';

interface RobotControlsProps {
  controller: RobotController;
  enabled: boolean;
  onCommand?: (command: RobotCommand) => void;
}

const controls: Array<{
  command: RobotCommand;
  label: string;
  position: string;
}> = [
  { command: 'forward', label: 'Forward', position: 'col-start-2 row-start-1' },
  { command: 'left', label: 'Left', position: 'col-start-1 row-start-2' },
  { command: 'stop', label: 'Stop', position: 'col-start-2 row-start-2' },
  { command: 'right', label: 'Right', position: 'col-start-3 row-start-2' },
  {
    command: 'backward',
    label: 'Backward',
    position: 'col-start-2 row-start-3',
  },
];

export function RobotControls({
  controller,
  enabled,
  onCommand,
}: RobotControlsProps) {
  const [error, setError] = useState<string | null>(null);
  const [activeCommand, setActiveCommand] = useState<RobotCommand | null>(null);

  const handleError = useCallback((caughtError: unknown) => {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : 'Unable to send robot command.',
    );
  }, []);

  const reportCommand = useCallback(
    (command: RobotCommand) => {
      setActiveCommand(command === 'stop' ? null : command);
      onCommand?.(command);
    },
    [onCommand],
  );

  const send = useCallback(
    (command: RobotCommand) => {
      setError(null);
      reportCommand(command);
      void controller[command]().catch(handleError);
    },
    [controller, handleError, reportCommand],
  );

  useKeyboardControls({
    controller,
    enabled,
    onCommand: reportCommand,
    onError: handleError,
  });

  return (
    <section aria-labelledby="controls-heading" className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="panel-label">Drive system</p>
          <h2
            id="controls-heading"
            className="mt-2 text-lg font-medium text-slate-100"
          >
            Drive control
          </h2>
        </div>
        <p className="font-mono text-xs text-slate-500">WASD / ARROWS</p>
      </div>

      <div className="drive-mode">
        <div>
          <p className="panel-label">Drive mode</p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            Autonomous navigation is not configured.
          </p>
        </div>
        <div className="flex shrink-0 border border-slate-700 font-mono text-xs tracking-wide">
          <span className="mode-state mode-state--active">MANUAL</span>
          <span className="mode-state mode-state--pending">ROAM</span>
        </div>
      </div>

      {error ? (
        <p className="mt-5 font-mono text-xs text-red-300">ERROR: {error}</p>
      ) : null}

      <div className="mx-auto mt-10 grid w-fit grid-cols-3 gap-1 border border-slate-700 bg-slate-700 p-1">
        {controls.map(({ command, label, position }) => {
          const isStop = command === 'stop';
          const isActive = activeCommand === command;

          return (
            <button
              key={command}
              type="button"
              aria-label={label}
              className={`control-button ${
                isStop
                  ? 'control-button--stop'
                  : isActive
                    ? 'control-button--active'
                    : ''
              } ${position}`}
              disabled={!enabled}
              onClick={() => isStop && send('stop')}
              onPointerCancel={() => !isStop && send('stop')}
              onPointerDown={() => !isStop && send(command)}
              onPointerLeave={() => !isStop && send('stop')}
              onPointerUp={() => !isStop && send('stop')}
            >
              <ControlIcon command={command} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="emergency-stop"
        disabled={!enabled}
        onClick={() => send('stop')}
      >
        Emergency stop
      </button>
    </section>
  );
}

function ControlIcon({ command }: { command: RobotCommand }) {
  if (command === 'stop') {
    return <span aria-hidden="true" className="h-5 w-5 bg-current" />;
  }

  const rotation = {
    backward: 'rotate-180',
    forward: '',
    left: '-rotate-90',
    right: 'rotate-90',
  }[command];

  return (
    <svg
      aria-hidden="true"
      className={`h-9 w-9 ${rotation}`}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20V4M6 10l6-6 6 6"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="2.5"
      />
    </svg>
  );
}
