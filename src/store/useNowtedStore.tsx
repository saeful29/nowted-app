import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import { FolderTypes, NoteTypes } from '@/types';

const generateFolderId = uuid();

export const DEFAULT_NOTES: NoteTypes = {
  id_note: uuid(),
  name: 'lets making story',
  content: 'Our Story......',
  folder_id: generateFolderId,
  createdAt: new Date(),
  deletedAt: null,
};

export type folderStateType = {
  folders: FolderTypes[];
  addFolder: (data: Pick<FolderTypes, 'name'>) => void;
  updateFolder: (data: Pick<FolderTypes, 'id_folder' | 'name'>) => void;
  removeFolder: (data: Pick<FolderTypes, 'id_folder'>) => void;
};

export type noteStateType = {
  note?: NoteTypes;
  addNote: (data: { id_folder: string | null }) => void;
  saveNote: (
    data: Pick<NoteTypes, 'content' | 'name' | 'folder_id' | 'id_note'>
  ) => void;
  removeNote: (data: Pick<NoteTypes, 'id_note' | 'folder_id'>) => void;
};

export const useNowtedStore = create<folderStateType & noteStateType>()(
  persist(
    (set) => ({
      folders: [
        {
          id_folder: generateFolderId,
          name: 'Personal',
          can_delete: false,
          notes: [{ ...DEFAULT_NOTES, folder_name: 'Personal' }],
          createdAt: new Date(),
        },
      ],
      addFolder: (data) => {
        set((state) => {
          const folderId = uuid();
          return {
            folders: [
              {
                id_folder: folderId,
                name: data.name,
                can_delete: true,
                notes: [
                  {
                    ...DEFAULT_NOTES,
                    content: 'Our Story......',
                    id_note: uuid(),
                    folder_id: folderId,
                    createdAt: new Date(),
                    folder_name: data.name,
                  },
                ],
                createdAt: new Date(),
              },
              ...state.folders,
            ],
          };
        });
      },
      updateFolder: (data) => {
        set((state) => {
          return {
            folders: state.folders.map((item) =>
              item.id_folder === data.id_folder
                ? { ...item, name: data.name }
                : item
            ),
          };
        });
      },
      removeFolder: (data) => {
        set((state) => {
          return {
            folders: state.folders.filter(
              (item) => item.id_folder !== data.id_folder
            ),
          };
        });
      },
      addNote: (data) => {
        set((state) => {
          if (data.id_folder === null) {
            const filtered = state.folders.find(
              (item) => item.can_delete === false
            );
            if (filtered) {
              filtered.notes = [
                {
                  content: 'Our Story......',
                  name: 'New Notes',
                  id_note: uuid(),
                  folder_id: filtered.id_folder,
                  createdAt: new Date(),
                  folder_name: filtered.name,
                  deletedAt: null,
                },
                ...filtered.notes!,
              ];
            }
            return { folders: [...state.folders] };
          }
          const filtered = state.folders.find(
            (item) => item.id_folder === data.id_folder
          );
          if (filtered) {
            filtered.notes = [
              {
                content: 'Our Story......',
                name: 'New Notes',
                id_note: uuid(),
                folder_id: filtered.id_folder,
                createdAt: new Date(),
                deletedAt: null,
                folder_name: filtered.name,
              },
              ...filtered.notes!,
            ];
          }
          return { folders: [...state.folders] };
        });
      },
      saveNote: (data) => {
        set((state) => {
          if (!data.folder_id) return { folders: state.folders };
          const getFolder = state.folders.find(
            (item) => item.id_folder === data.folder_id
          ) as FolderTypes;
          if (getFolder) {
            const getNote = getFolder!.notes!.find(
              (item: NoteTypes) => item.id_note === data.id_note
            ) as NoteTypes;
            getNote.name = data.name as string;
            getNote.content = data.content as string;
          }
          return { folders: [...state.folders] };
        });
      },
      removeNote: (data) => {
        set((state) => {
          const folders = state.folders.find(
            (item) => item.id_folder === data.folder_id
          );
          if (folders) {
            const notes = folders.notes;
            const note = notes?.find(
              (item: NoteTypes) => item.id_note === data.id_note
            ) as NoteTypes;
            note.deletedAt = new Date();
          }

          return { folders: [...state.folders] };
        });
      },
    }),
    {
      name: 'folder-notes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
