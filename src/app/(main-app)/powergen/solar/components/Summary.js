import classNames from "classnames";
import numeral from "numeral";

const ProgressBar = ({ progressColor, value, totalValue }) => {
  return (
    <div className="items-center sm:flex py-1">
      <div className="relative block h-4.5 w-full rounded bg-slate-100">
        <div
          style={{ width: `${(value / totalValue) * 100}%` }}
          className={`flex h-full items-center justify-center rounded ${progressColor} text-xs font-medium text-white`}
        >
          {numeral((value / totalValue) * 100).format("0,0.0")} %
        </div>
      </div>
    </div>
  );
};

const Summary = ({ data }) => {
  let bg_color = "";
  if (data.title == "Power") {
    bg_color = "#FF6B6B";
  } else if (data.title == "Today Energy") {
    bg_color = "#54A0FF";
  } else {
    bg_color = "#6577F3";
  }

  return (
    <div className="flex flex-col rounded-xl border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box">
      <h4 className="font-semibold text-md text-enzy-dark dark:text-white text-center">
        {data.title}
      </h4>

      <h4 className="font-bold text-2xl text-enzy-dark dark:text-white text-center mb-4">
        {numeral(data.total).format("0,0.0")}{" "}
        {data.type == "power" ? "kW" : "kWh"}
      </h4>

      {data.data.map((item, index) => {
        return (
          <div className="grid grid-cols-5 gap-2 items-center" key={index}>
            <div className="text-sm">{item.name}</div>
            <div className="col-span-3">
              <ProgressBar
                progressColor={`bg-[${bg_color}]`}
                value={item.value}
                totalValue={data.total}
              />
            </div>
            <div className="text-sm">
              {numeral(item.value).format("0,0.0")}{" "}
              {data.type == "power" ? "kW" : "kWh"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
