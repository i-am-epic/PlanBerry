"use client";

import { createContext, useCallback, useContext, useState } from "react";
import ContactModal from "@/components/ContactModal";

type ModalCtx = {
  openContact: () => void;
  closeContact: () => void;
};

const Ctx = createContext<ModalCtx | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ openContact, closeContact }}>
      {children}
      <ContactModal open={open} onClose={closeContact} />
    </Ctx.Provider>
  );
}

export function useContactModal(): ModalCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used inside <ModalProvider>");
  return ctx;
}
