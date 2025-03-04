export default function Card() {
  return (
    <div className="rounded border border-stroke bg-white py-6 px-8 shadow-default dark:border-slate-800 dark:bg-dark-box">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-enzy-dark dark:text-white">
            $3.456K
          </h4>
          <span className="text-sm text-secondary font-medium">
            Total views
          </span>
        </div>

        <span className="flex items-center gap-1 text-sm font-medium text-enzy-dark dark:text-white">
          0.43%
        </span>
      </div>
    </div>
  );
}
