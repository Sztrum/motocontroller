import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SerialClient } from '../../../types/serial';
import { useConnection } from './use-connection';

function createClient(): SerialClient {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    write: vi.fn().mockResolvedValue(undefined),
  };
}

describe('useConnection', () => {
  it('connects the client and exposes the connected status', async () => {
    const client = createClient();
    const { result } = renderHook(() =>
      useConnection({ beforeDisconnect: vi.fn(), client }),
    );

    await act(async () => {
      await result.current.connect();
    });

    expect(client.connect).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('connected');
  });

  it('stops control before disconnecting the client', async () => {
    const client = createClient();
    const beforeDisconnect = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useConnection({ beforeDisconnect, client }),
    );

    await act(async () => {
      await result.current.disconnect();
    });

    expect(beforeDisconnect).toHaveBeenCalledBefore(
      client.disconnect as ReturnType<typeof vi.fn>,
    );
    expect(result.current.status).toBe('disconnected');
  });
});
