import { Suspense } from "react";
import SetupContent from "./setupcontent";



export default function SetupPage() {
  return (
    <Suspense fallback={<div className="text-white p-6 text-center">Loading...</div>}>
      <SetupContent />
    </Suspense>
  );
}
