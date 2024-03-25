import React from 'react';

interface DownloadProgressModalProps {
  progress: number;
}

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  progress,
}) => {
  const roundedProgress = Math.round(progress * 100) / 100; // Round progress to two decimal places
  const readableProgress = `${roundedProgress}%`;
  if (!progress) return <></>;
  else
    return (
      <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4'>
          <h2 className='text-xl font-semibold mb-6 text-center'>
            Image Download in Progress
          </h2>
          <div className='w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700'>
            <div
              className='bg-red-600 h-2.5 rounded-full'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-600'>
              Download Progress:{' '}
              <span className='font-medium'>{readableProgress}</span>
            </p>
          </div>
        </div>
      </div>
    );
};

export default DownloadProgressModal;
