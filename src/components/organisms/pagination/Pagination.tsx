import { Button, Icon } from "@/components/atoms";
import { IPaginationProps } from "./types";

export function Pagination(props: IPaginationProps) {
  const { onClickNext, onClickPrev, currentPage, totalForPage } = props;
  return (
    <div className="flex gap-2 items-center w-full justify-end mt-5">
      <Button isDisabled={currentPage <= 1} onClick={onClickPrev}>
        <Icon variant="prev" />
      </Button>
      <p>Pagina {currentPage}</p>
      <Button isDisabled={totalForPage === 0} onClick={onClickNext}>
        <Icon variant="next" />
      </Button>
    </div>
  );
}

export default Pagination;
