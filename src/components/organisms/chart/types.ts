export interface IData {
  time: string;
  value: number;
}

export interface IChartProps {
  data: IData[];
  title: string;
}
