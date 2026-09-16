import { serialConfig } from '../../../config/serial';
import type { ConnectionStatus } from '../model/connection-status';

interface ConnectionPanelProps {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  status: ConnectionStatus;
}

const statusLabels: Record<ConnectionStatus, string> = {
  connected: 'CONNECTED',
  connecting: 'CONNECTING',
  disconnected: 'DISCONNECTED',
  error: 'CONNECTION ERROR',
};

export function ConnectionPanel({
  connect,
  disconnect,
  error,
  status,
}: ConnectionPanelProps) {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <section aria-labelledby="connection-heading" className="p-6 sm:p-8">
      <p className="panel-label">Interface</p>
      <h2
        id="connection-heading"
        className="mt-2 text-lg font-medium text-slate-100"
      >
        Connection
      </h2>

      <div className="mt-8 border-y border-slate-700/80 py-5">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span
            aria-hidden="true"
            className={`status-indicator ${
              isConnected
                ? 'status-indicator--connected'
                : status === 'connecting'
                  ? 'status-indicator--pending'
                  : 'status-indicator--disconnected'
            }`}
          />
          <span className={isConnected ? 'text-emerald-300' : 'text-slate-300'}>
            {statusLabels[status]}
          </span>
        </div>
        <dl className="mt-5 space-y-3 font-mono text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">TRANSPORT</dt>
            <dd className="text-slate-300">USB SERIAL</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">BAUD RATE</dt>
            <dd className="text-slate-300">{serialConfig.baudRate}</dd>
          </div>
        </dl>
      </div>

      {error ? (
        <p className="mt-5 font-mono text-xs text-red-300">ERROR: {error}</p>
      ) : null}

      <button
        type="button"
        className="connection-button"
        disabled={isConnecting}
        onClick={() => void (isConnected ? disconnect() : connect())}
      >
        {isConnected
          ? 'Disconnect device'
          : isConnecting
            ? 'Connecting…'
            : 'Connect device'}
      </button>
    </section>
  );
}
