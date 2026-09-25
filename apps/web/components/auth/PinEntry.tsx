"use client";

import { useEffect, useState } from "react";

const PIN_LENGTH = 4;
const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

export function PinEntry({
  learnerName,
  avatarEmoji,
  avatarBg,
  onSubmitPin,
  onSuccess,
  onCancel,
}: {
  learnerName: string;
  avatarEmoji: string;
  avatarBg: string;
  /** Verifies the PIN server-side. Resolve true/false - never compare PINs on the client. */
  onSubmitPin: (pin: string) => Promise<boolean>;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  useEffect(() => {
    if (pin.length < PIN_LENGTH || status !== "idle") return;
    let cancelled = false;
    setStatus("checking");

    onSubmitPin(pin).then((ok) => {
      if (cancelled) return;
      if (ok) {
        onSuccess();
      } else {
        setStatus("error");
        setTimeout(() => {
          if (cancelled) return;
          setPin("");
          setStatus("idle");
        }, 700);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  function press(key: (typeof KEYPAD_KEYS)[number]) {
    if (status !== "idle") return;
    if (key === "back") {
      setPin((p) => p.slice(0, -1));
    } else if (key !== "" && pin.length < PIN_LENGTH) {
      setPin((p) => p + key);
    }
  }

  const error = status === "error";

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <button onClick={onCancel} className="text-sm font-semibold text-text-secondary">
        ← Not {learnerName}?
      </button>

      <div className="flex flex-col items-center gap-3">
        <span className={`flex size-16 items-center justify-center rounded-full text-3xl ${avatarBg}`}>
          {avatarEmoji}
        </span>
        <p className="font-display text-lg font-bold text-text-primary">Enter {learnerName}&apos;s PIN</p>
      </div>

      <div className={`flex gap-3 ${error ? "animate-pulse" : ""}`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={`size-4 rounded-full border-2 ${
              error
                ? "border-danger-600 bg-danger-100"
                : i < pin.length
                  ? "border-brand-600 bg-brand-600"
                  : "border-border-default bg-transparent"
            }`}
          />
        ))}
      </div>
      {error && <p className="-mt-3 text-sm font-semibold text-danger-600">That&apos;s not quite right. Try again!</p>}
      {status === "checking" && <p className="-mt-3 text-sm font-semibold text-text-secondary">Checking...</p>}

      <div className="grid grid-cols-3 gap-3">
        {KEYPAD_KEYS.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(key)}
              aria-label={key === "back" ? "Delete" : key}
              className="flex size-16 items-center justify-center rounded-full border border-border-light bg-surface font-display text-xl font-bold text-text-primary hover:bg-app-bg"
            >
              {key === "back" ? "⌫" : key}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
