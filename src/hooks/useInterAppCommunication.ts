"use client";

import { useState, useEffect, useCallback } from "react";
import { InterAppCommunicator, SharedStateManager, createCommunicationHub, ConnectionStatus, AppMessage } from "@/lib/inter-app-communication";

/**
 * React hook for inter-app communication
 */
export function useInterAppCommunication(appId: string, autoConnect: boolean = true) {
  const [hub] = useState(() => createCommunicationHub(appId));
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<AppMessage[]>([]);

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = hub.communicator.onStatusChange(setStatus);

    // Auto-connect if enabled
    if (autoConnect && typeof window !== "undefined") {
      // Note: In production, you'd connect to a real WebSocket server
      // For demo purposes, we simulate the connection
      console.log(`App ${appId} ready for communication`);
    }

    return () => {
      unsubscribe();
      hub.communicator.disconnect();
    };
  }, [appId, autoConnect, hub]);

  useEffect(() => {
    // Listen for all messages
    const unsubscribe = hub.communicator.on("*", (message) => {
      setMessages(prev => [message, ...prev].slice(0, 50)); // Keep last 50 messages
    });

    return unsubscribe;
  }, [hub]);

  const sendMessage = useCallback((targetAppId: string, payload: any, type: AppMessage["type"] = "request") => {
    hub.communicator.sendTo(targetAppId, payload, type);
  }, [hub]);

  const broadcast = useCallback((payload: any) => {
    hub.communicator.broadcast(payload);
  }, [hub]);

  const connect = useCallback((url?: string) => {
    hub.communicator.connect(url);
  }, [hub]);

  const disconnect = useCallback(() => {
    hub.communicator.disconnect();
  }, [hub]);

  return {
    status,
    messages,
    sendMessage,
    broadcast,
    connect,
    disconnect,
    communicator: hub.communicator,
    stateManager: hub.stateManager,
  };
}

/**
 * React hook for shared state management
 */
export function useSharedState<T = any>(
  stateManager: SharedStateManager,
  key: string,
  initialValue?: T
) {
  const [value, setValue] = useState<T | undefined>(() => {
    const existing = stateManager.get<T>(key);
    return existing !== undefined ? existing : initialValue;
  });

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = stateManager.subscribe(key, (newValue) => {
      setValue(newValue);
    });

    return unsubscribe;
  }, [stateManager, key]);

  const setSharedValue = useCallback((newValue: T, broadcast: boolean = true) => {
    stateManager.set(key, newValue, broadcast);
  }, [stateManager, key]);

  const deleteSharedValue = useCallback((broadcast: boolean = true) => {
    stateManager.delete(key, broadcast);
  }, [stateManager, key]);

  return [value, setSharedValue, deleteSharedValue] as const;
}
