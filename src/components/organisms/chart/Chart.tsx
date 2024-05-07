import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";
export function Chart() {
  const chartContainerRef = useRef<any>();

  const colors = {
    backgroundColor: "#000000",
    lineColor: "#5A57EE",
    textColor: "white",
    areaTopColor: "#5A57EE",
    areaBottomColor: "rgba(90, 87, 238,0.28)",
  };

  const data = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

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
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);
  return (
    <div>
      <div ref={chartContainerRef} />
    </div>
  );
}

export default Chart;
