export default function TopStylesBars({ data }: { data: { style: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">No orders yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.style} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-28 shrink-0 truncate">{d.style}</span>
          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#7C3AED]"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-900 font-medium w-6 text-right shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
