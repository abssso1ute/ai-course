import React, { Suspense, lazy } from "react";

const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsPage />
    </Suspense>
  );
}