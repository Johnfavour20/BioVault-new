import React from 'react';

const Shimmer: React.FC = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
);

const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative overflow-hidden bg-[var(--muted-background)] rounded-lg ${className}`}>
    <Shimmer />
  </div>
);

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonBox className="h-8 w-1/3" />
        <SkeletonBox className="h-5 w-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonBox className="h-36 rounded-2xl" />
        <SkeletonBox className="h-36 rounded-2xl" />
        <SkeletonBox className="h-36 rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SkeletonBox className="h-28 rounded-2xl" />
        <SkeletonBox className="h-28 rounded-2xl" />
        <SkeletonBox className="h-28 rounded-2xl" />
        <SkeletonBox className="h-28 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonBox className="h-64 rounded-2xl" />
        <SkeletonBox className="h-64 rounded-2xl" />
      </div>

      <SkeletonBox className="h-72 rounded-2xl" />
    </div>
  );
};

export default DashboardSkeleton;