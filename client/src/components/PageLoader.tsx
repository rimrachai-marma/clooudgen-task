import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="mt-12 h-full w-full flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-gray-800" />
        <span className="text-sm font-medium text-gray-600">Loading...</span>
      </div>
    </div>
  );
}
