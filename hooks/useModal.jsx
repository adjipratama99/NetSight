import { useState } from "react";

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false)
  }
}