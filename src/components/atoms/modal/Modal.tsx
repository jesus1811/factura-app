import { useEffect, useRef } from "react";
import { IModalProps } from "./types";
import classNames from "classnames";
import Icon from "../icon/Icon";

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
    <section className="w-screen h-screen fixed bg-black bg-opacity-50 z-20 top-0 left-0 flex flex-col justify-center items-center">
      <article
        ref={modalRef}
        className={classNames("relative", className)}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div onClick={closeModal} className=" cursor-pointer absolute hover:bg-gray-600 right-3 top-3 fill-white bg-gray-500 rounded-full w-8 aspect-square flex justify-center items-center">
          <Icon variant="close" />
        </div>
        {children}
      </article>
    </section>
  );
}

export default Modal;
