import { useState, ChangeEvent } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DownloadProgressModal from './DownloadProgress';
import Table from './Table';

const App = () => {
  const [fileContent, setFileContent] = useState<
    { url: string; selected: boolean }[]
  >([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const objects = text
        .split('\n')
        .filter((line) => line)
        .map((url) => ({ url, selected: false }));
      setFileContent(objects);
    };
    reader.readAsText(file);
  };

  const downloadAndZipImages = async (selectedImageUrls: string[]) => {
    const zip = new JSZip();
    setIsDownloading(true);
    const batchSize = 10;
    const totalFiles = selectedImageUrls.length;
    let filesDownloaded = 0;

    const promises: Promise<void>[] = [];

    for (let i = 0; i < totalFiles; i += batchSize) {
      const batchUrls = selectedImageUrls.slice(i, i + batchSize);
      const batchPromises = batchUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(`image${i + index + 1}.${blob.type.split('/')[1]}`, blob, {
            binary: true,
          });
          filesDownloaded++;
          const progress = (filesDownloaded / totalFiles) * 100;
          setUploadProgress(progress); // Update the progress
        } catch (error) {
          console.error('Error with image:', url, error);
        }
      });

      promises.push(...batchPromises);
    }

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });

    saveAs(content, 'images.zip');
  };

  const handleDownloadClick = async () => {
    const selectedUrls = fileContent
      .filter((item) => item.selected)
      .map((item) => item.url);

    await downloadAndZipImages(selectedUrls);

    setUploadProgress(0);
    setIsDownloading(false);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-red-500 text-white p-4 text-center'>
        <h1 className='text-xl font-semibold'>Image Zipper</h1>
      </header>

      <main className='flex-grow p-4 flex flex-col items-center justify-start space-y-4'>
        <input
          type='file'
          accept='.csv'
          onChange={handleFileUpload}
          className='mb-4'
        />
        <Table
          data={fileContent}
          onSelect={(index: number) => {
            setFileContent((current) =>
              current.map((item, i) => ({
                ...item,
                selected: i === index ? !item.selected : item.selected,
              }))
            );
          }}
          onSelectAll={(selected: boolean) => {
            setFileContent((current) =>
              current.map((item) => ({
                ...item,
                selected: selected,
              }))
            );
          }}
        />

        <button
          disabled={!fileContent.some((item) => item.selected) || isDownloading}
          onClick={handleDownloadClick}
          className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {isDownloading ? (
            <span className='flex items-center gap-4'>
              <svg
                aria-hidden='true'
                data-testid='loading-spinner'
                className='size-5 animate-spin fill-red-600 text-gray-200 dark:text-gray-200'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />

                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              Downloading...
            </span>
          ) : (
            'Download Selected Images'
          )}
        </button>
      </main>

      {isDownloading && <DownloadProgressModal progress={uploadProgress} />}
    </div>
  );
};

export default App;
