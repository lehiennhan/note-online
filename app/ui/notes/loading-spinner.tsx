'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#45475a] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#cba6f7] rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-[#a6adc8] font-medium">Loading...</p>
    </div>
  );
}
