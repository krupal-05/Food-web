import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};

export const FoodCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3 animate-pulse"
        >
          <div className="w-full h-44 bg-slate-200 rounded-2xl" />
          <div className="flex justify-between items-center pt-1">
            <div className="h-5 w-2/3 bg-slate-200 rounded-md" />
            <div className="h-5 w-12 bg-slate-200 rounded-md" />
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-md" />
          <div className="h-3 w-4/5 bg-slate-200 rounded-md" />
          <div className="flex justify-between items-center pt-2 mt-auto">
            <div className="h-7 w-20 bg-slate-200 rounded-lg" />
            <div className="h-9 w-28 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="h-12 bg-slate-100 border-b border-slate-200/80" />
      <div className="p-4 flex flex-col gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-slate-200/80 rounded-md flex-1 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
