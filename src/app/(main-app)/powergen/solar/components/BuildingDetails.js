
import numeral from "numeral";

const BuildingDetails = ({ data }) => {
    return (
        <div className="flex flex-col rounded-xl bg-white p-7 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
            <div className="flex items-center dark:border-strokedark">
                <h4 className="font-semibold text-xl text-black dark:text-white">
                    Building details
                </h4>
            </div>

            <div className="rounded-sm h-full border-stroke bg-white my-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
                <div className="flex flex-col">
                    <div className="grid grid-cols-4 rounded-t-lg bg-slate-100 dark:bg-slate-600 dark:text-light">
                        <div className="p-2.5 xl:px-5 xl:py-3">
                            <h5 className="text-sm font-medium  xsm:text-base">
                                Building Name
                            </h5>
                        </div>
                        <div className="p-2.5 xl:px-5 xl:py-3 text-center">
                            <h5 className="text-sm font-medium  xsm:text-base">
                                Power (kW)
                            </h5>
                        </div>
                        <div className="p-2.5 xl:px-5 xl:py-3 text-center">
                            <h5 className="text-sm font-medium  xsm:text-base">
                                Today Energy (kWh)
                            </h5>
                        </div>
                        <div className="p-2.5 xl:px-5 xl:py-3 text-center">
                            <h5 className="text-sm font-medium  xsm:text-base">
                                Total Energy (kWh)
                            </h5>
                        </div>
                    </div>

                    {data.map((item, index) => {
                        return (
                            <div key={index} className="grid grid-cols-4 border border-slate-100 dark:border-slate-400">
                                <div className="flex items-center gap-3 p-4">
                                    <p className="hidden text-black dark:text-white sm:block">{item.name}</p>
                                </div>

                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{numeral(item.power).format("0,0.0")}</p>
                                </div>

                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{numeral(item.today_energy).format("0,0.0")}</p>
                                </div>

                                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                    <p className="text-enzy-success">{numeral(item.total_energy).format("0,0.0")}</p>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>

    )
}

export default BuildingDetails;