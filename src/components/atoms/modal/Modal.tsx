import { useRef } from "react";
import { IModalProps } from "./types";

export function Modal(props: IModalProps) {
  const { children, className, closeModal, isModal } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  if (!isModal) return null;
  return (
    <section onClick={closeModal} className="w-screen h-screen fixed bg-black bg-opacity-80 z-20 top-0 left-0 flex flex-col justify-center items-center">
      <article
        ref={modalRef}
        className={className}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </article>
    </section>
  );
}

export default Modal;
