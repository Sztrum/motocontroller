import { useCallback, useState } from 'react';
import { ConnectionPanel } from '../features/connection/components/connection-panel';
import { useConnection } from '../features/connection/hooks/use-connection';
import { RobotControls } from '../features/robot-control/components/robot-controls';
import type { RobotCommand } from '../features/robot-control/model/robot-command';
import { createRobotController } from '../features/robot-control/model/robot-controller';
import { WebSerialClient } from '../lib/serial/web-serial-client';

interface CommandLogEntry {
  command: RobotCommand;
  time: string;
}

export function App() {
  const [serialClient] = useState(() => new WebSerialClient());
  const [robotController] = useState(() => createRobotController(serialClient));
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>([]);
  const connection = useConnection({
    beforeDisconnect: robotController.stop,
    client: serialClient,
  });

  const recordCommand = useCallback((command: RobotCommand) => {
    const time = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    setCommandLog((entries) => [{ command, time }, ...entries].slice(0, 8));
  }, []);

  const lastCommand = commandLog[0]?.command ?? '—';
  const isConnected = connection.status === 'connected';

  return (
    <main className="min-h-screen px-4 py-4 sm:px-8 sm:py-8">
      <div className="device-panel mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-6 border-b border-slate-700/80 px-6 py-5 sm:px-8">
          <div>
            <p className="panel-label">Vehicle interface / v0.1</p>
            <h1 className="mt-2 text-xl font-medium tracking-[0.08em] text-slate-100">
              ROVER CONTROL
            </h1>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs tracking-wide">
            <span
              aria-hidden="true"
              className={`status-indicator ${isConnected ? 'status-indicator--connected' : 'status-indicator--disconnected'}`}
            />
            <span
              className={isConnected ? 'text-emerald-300' : 'text-slate-400'}
            >
              {isConnected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
          <RobotControls
            controller={robotController}
            enabled={isConnected}
            onCommand={recordCommand}
          />

          <aside className="border-t border-slate-700/80 lg:border-l lg:border-t-0">
            <ConnectionPanel {...connection} />
            <section
              className="border-t border-slate-700/80 p-6 sm:p-8"
              aria-labelledby="last-command-heading"
            >
              <p id="last-command-heading" className="panel-label">
                Last command
              </p>
              <p className="mt-3 font-mono text-xl tracking-wide text-slate-200">
                {lastCommand.toUpperCase()}
              </p>
            </section>
          </aside>
        </div>

        <section
          className="border-t border-slate-700/80 px-6 py-5 sm:px-8"
          aria-labelledby="command-log-heading"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="command-log-heading" className="panel-label">
              Command log
            </h2>
            <span className="font-mono text-xs text-slate-600">LATEST 8</span>
          </div>
          <div className="mt-4 min-h-20 space-y-1 font-mono text-xs tracking-wide text-slate-400">
            {commandLog.length > 0 ? (
              commandLog.map((entry, index) => (
                <p key={`${entry.time}-${entry.command}-${index}`}>
                  <span className="mr-5 text-slate-600">{entry.time}</span>
                  <span
                    className={
                      entry.command === 'stop'
                        ? 'text-red-300'
                        : 'text-slate-300'
                    }
                  >
                    {entry.command.toUpperCase()}
                  </span>
                </p>
              ))
            ) : (
              <p className="text-slate-600">No commands sent.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
