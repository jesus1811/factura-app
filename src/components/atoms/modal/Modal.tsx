import { useEffect, useRef } from "react";
import { IModalProps } from "./types";
import classNames from "classnames";

export function Modal(props: IModalProps) {
  const { children, className, closeModal, isModal } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!closeModal) return;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });
    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      });
    };
  }, []);

  if (!isModal) return null;
  return (
    <section onClick={closeModal} className="w-screen h-screen fixed bg-black bg-opacity-80 z-20 top-0 left-0 flex flex-col justify-center items-center">
      <article
        ref={modalRef}
        className={classNames("relative", className)}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div onClick={closeModal} className=" cursor-pointer absolute right-3 top-3 fill-white bg-gray-500 rounded-full w-8 aspect-square flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>
        {children}
      </article>
    </section>
  );
}

export default Modal;
