import { useCallback, useState } from 'react';
import type { SerialClient } from '../../../types/serial';
import type { ConnectionStatus } from '../model/connection-status';

interface UseConnectionOptions {
  client: SerialClient;
  beforeDisconnect: () => Promise<void>;
}

export function useConnection({
  client,
  beforeDisconnect,
}: UseConnectionOptions) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      await client.connect();
      setStatus('connected');
    } catch (caughtError) {
      setStatus('error');
      setError(getErrorMessage(caughtError));
    }
  }, [client]);

  const disconnect = useCallback(async () => {
    try {
      await beforeDisconnect();
      await client.disconnect();
      setStatus('disconnected');
      setError(null);
    } catch (caughtError) {
      setStatus('error');
      setError(getErrorMessage(caughtError));
    }
  }, [beforeDisconnect, client]);

  return { connect, disconnect, error, status };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unknown connection error occurred.';
}
