export default function StatisticsCard({ title, sessions, kwh, revenue }) {
    return (
      <div className="flex-1 p-6 dark:border-slate-800 dark:bg-dark-box dark:text-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">{title}</h2>
        <div className="flex justify-between text-center text-gray-700">
          <div className="flex-1">
            <div className="text-xl font-bold dark:text-white">{sessions}</div>
            <div className="text-sm text-gray-500 mt-1">Sessions Charged</div>
          </div>
          <div className="w-px bg-gray-200 mx-4" />
          <div className="flex-1">
            <div className="text-xl font-bold dark:text-white">{kwh}</div>
            <div className="text-sm text-gray-500 mt-1">kWh Charged</div>
          </div>
          <div className="w-px bg-gray-200 mx-4" />
          <div className="flex-1">
            <div className="text-xl font-bold dark:text-white">{revenue}</div>
            <div className="text-sm text-gray-500 mt-1">Revenue Earned</div>
          </div>
        </div>
      </div>
    );
  }
  