import Image from 'next/image'

const Summary = ({ data }) => {
    return (
        <div className="flex flex-col rounded-md justify-between  bg-light p-4 shadow-default dark:border-slate-800 dark:bg-dark-box">
            <div className="flex justify-between items-center dark:border-strokedark">
                <div>
                    <h4 className="font-semibold text-xl text-enzy-dark dark:text-white">
                        {data.title}
                    </h4>
                    <div className='pt-3'>
                        <div>Today</div>
                        <div className='text-xl font-bold'>{data.today} kWh</div>
                    </div>
                </div>
                <Image src={data.image} alt="" height={80} width={80} />
            </div>

            <div className='pt-3'>
                <div className="flex justify-between">
                    <div>This Month</div>
                    <div>{data.this_month/1000} MWh</div>
                </div>
                <div className="flex justify-between">
                    <div>Total</div>
                    <div>{data.total/1000} MWh</div>
                </div>
            </div>

        </div>
    )
}

export default Summary;