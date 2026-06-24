type Listener = () => void;

let listeners: Listener[] = [];

export function onSessionExpired(callback: Listener) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function emitSessionExpired() {
  listeners.forEach((l) => l());
}