import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
}

// Janela que aparece por cima da tela (popup). Fecha ao clicar no X ou no fundo.
export function Modal({ titulo, aoFechar, children }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titulo}</h3>
          <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
