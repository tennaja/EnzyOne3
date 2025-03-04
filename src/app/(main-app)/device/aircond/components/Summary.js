import Image from 'next/image'

const Summary = ({ data }) => {
    return (
        <div className="flex flex-col rounded-xl justify-between border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box">
            <div className="flex justify-between items-start dark:border-strokedark">
                <h4 className="font-semibold text-xl text-enzy-dark dark:text-white">
                    {data.title}
                </h4>
                <Image src={data.image} alt="" height={100} width={100} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <span className="text-3xl font-semibold">{data.today}</span>
                    <span> kWh</span>
                    <div className="text-md text-gray-400">Today</div>
                </div>
                <div className="text-center">
                    <span className="text-3xl font-semibold">{data.total/1000}</span>
                    <span className=""> MWh</span>
                    <div className="text-md text-gray-400">Total</div>
                </div>
            </div>
        </div>
    )
}

export default Summary;