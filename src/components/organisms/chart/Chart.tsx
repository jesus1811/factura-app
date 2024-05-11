import { Title } from "@/components/atoms";
import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { IChartProps } from "./types";
export function Chart(props: IChartProps) {
  const { data, title } = props;
  const chartContainerRef = useRef<any>();

  const colors = {
    backgroundColor: "#020202",
    lineColor: "#5A57EE",
    textColor: "white",
    areaTopColor: "#5A57EE",
    areaBottomColor: "rgba(90, 87, 238,0.28)",
  };

  const combinedData = data.reduce((acc: { time: string; value: number }[], curr) => {
    const existingItem = acc.find((item) => item.time === curr.time);
    if (existingItem) {
      existingItem.value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
  const { areaBottomColor, textColor, backgroundColor, areaTopColor, lineColor } = colors;

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      handleScale: {
        axisPressedMouseMove: false,
        axisDoubleClickReset: false,
        mouseWheel: false,
        pinch: false,
      },
      handleScroll: {
        vertTouchDrag: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
      },

      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
    newSeries.setData(combinedData);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, combinedData]);
  return (
    <div className="rounded-lg border border-gray-500 py-2.5 px-5 flex-1">
      <Title>{title}</Title>
      <div>
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}

export default Chart;
