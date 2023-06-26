'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import useFolderState from '@/hooks/useFolderState';
import { useNowtedStore } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import { useRecentStore } from '@/store/useRecentStore';
import { NoteTypes } from '@/types';
import { FiPlus } from 'react-icons/fi';

function CreateNote() {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { folderId } = params;
  const { folders } = useFolderState();

  const addNote = useNowtedStore((state) => state.addNote);
  const addRecent = useRecentStore((state) => state.addToRecents);

  const addingNewNotes = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addNote({ id_folder: folderId });
        resolve(1);
      }, 1000);
    });
  };

  const handleCreateNote = async () => {
    setLoading(true);
    await addingNewNotes();
    const getFolder = folders.find((item) => item.id_folder === folderId);
    setLoading(false);
    toast({
      title: 'Note succesfully created',
      variant: 'success',
    });
    const notes = getFolder!.notes as NoteTypes[];
    const data = notes[0];
    addRecent(data);
    return;
  };

  return (
    <div className="px-[20px]">
      <Button
        className="w-full text-[16px] font-semibold"
        size={'lg'}
        isLoading={isLoading}
        disabled={params.folderId ? false : true}
        variant={'secondary'}
        onClick={() => handleCreateNote()}
      >
        {isLoading ? null : <FiPlus className="text-[20px] mr-2" />}
        <span>New Note</span>
      </Button>
    </div>
  );
}

export default CreateNote;
