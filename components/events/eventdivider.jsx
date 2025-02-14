export default function EventDivider({ text }) {
  return (
    <div className="relative mb-6 h-8 w-full">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-[#B24531] px-4 py-1 text-sm font-semibold text-white">
        {text}
      </div>
    </div>
  );
}
