export interface IPaginationProps {
  onClickPrev: () => void;
  onClickNext: () => void;
  currentPage: number;
  totalForPage: number;
}
