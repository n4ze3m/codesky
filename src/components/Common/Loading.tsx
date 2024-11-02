import React from 'react';

export const GitCloneLoading = () => {
  const [lines, setLines] = React.useState<string[]>([]);
  const [currentStage, setCurrentStage] = React.useState(0);

  const stages = [
    { message: '~/feeds $ git clone new-feeds.git', delay: 500 },
    { message: 'Cloning into \'repo\'...', delay: 500 },
    { message: 'remote: Enumerating objects: 892, done.', delay: 500 },
    { message: 'remote: Counting objects: 100% (892/892), done.', delay: 500 },
    { message: 'remote: Compressing objects: 100% (456/456), done.', delay: 500 },
    { message: 'Receiving objects: 100% (892/892), 2.31 MiB | 3.42 MiB/s', delay: 500 },
    { message: 'Resolving deltas: 100% (342/342), done.', delay: 500 },
    { message: 'Updating files: 100% (123/123), done.', delay: 500 }
  ];

  React.useEffect(() => {
    if (currentStage < stages.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, stages[currentStage].message]);
        setCurrentStage(prev => prev + 1);
      }, stages[currentStage].delay);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  return (
    <div className="font-mono text-sm space-y-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-4">
      {lines.map((line, index) => (
        <div key={index} className="text-[#d4d4d4]">
          {line}
        </div>
      ))}
      {lines.length < stages.length && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 border-2 border-[#569cd6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-[#d4d4d4] animate-pulse">_</span>
        </div>
      )}
    </div>
  );
};