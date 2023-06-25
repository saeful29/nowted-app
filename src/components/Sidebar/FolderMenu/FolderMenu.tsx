'use client';
import DialogDelete from './DeleteFolder';
import CreateFolder from './CreateFolder';
import SaveFolder from './SaveFolder';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Disable SSR
const FolderLists = dynamic(() => import('./FolderLists'), {
  ssr: false,
  loading: () => (
    <>
      <div className="flex flex-col gap-[15px] h-[50px] items-center justify-center">
        <div className="flex items-center px-[30px] justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    </>
  ),
});

const FolderMenu: React.FC = () => {
  return (
    <div className="flex flex-col space-y-[8px]">
      <div className="flex justify-between items-center px-[30px] inactive-text">
        <p className="text-[14px] font-semibold">Folders</p>
        <SaveFolder />
      </div>
      <div className="flex flex-col gap-[5px]">
        <CreateFolder />
        <FolderLists />
      </div>

      {/* dialog delete folder */}
      <DialogDelete />
    </div>
  );
};

export default FolderMenu;
