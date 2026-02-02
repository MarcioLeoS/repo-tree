import { useState, useEffect, useCallback } from 'react';
import type { RepoLibrary, FolderNode, RepoItem } from '../types/reponest';

const API_URL = import.meta.env.VITE_API_URL || '/api.php';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

async function loadLibrary(): Promise<RepoLibrary> {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error('Error loading library:', error);
    throw error;
  }
}

async function saveLibrary(library: RepoLibrary): Promise<void> {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(library),
    });
  } catch (error) {
    console.error('Error saving library:', error);
  }
}

export function useRepoLibrary() {
  const [library, setLibrary] = useState<RepoLibrary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLibrary()
      .then(setLibrary)
      .catch((err) => {
        console.error('Error loading library:', err);
        setError('Error al cargar los datos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (library && !isLoading) {
      saveLibrary(library);
    }
  }, [library, isLoading]);

  const resetToSeed = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(API_URL);
    const data = await response.json();
    setLibrary(data);
    setIsLoading(false);
  }, []);

  const importFromJson = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString) as RepoLibrary;
      setLibrary(data);
      return true;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return false;
    }
  }, []);

  const findFolder = useCallback((folderId: string, node: FolderNode): FolderNode | null => {
    if (node.id === folderId) return node;
    for (const folder of node.folders) {
      const found = findFolder(folderId, folder);
      if (found) return found;
    }
    return null;
  }, []);

  const findParentFolder = useCallback((folderId: string, node: FolderNode): FolderNode | null => {
    for (const folder of node.folders) {
      if (folder.id === folderId) return node;
      const found = findParentFolder(folderId, folder);
      if (found) return found;
    }
    return null;
  }, []);

  const createFolder = useCallback((parentId: string, name: string) => {
    if (!name.trim() || !library) return;
    
    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const parent = findFolder(parentId, newLibrary.root);
      if (!parent) return prev;

      const newFolder: FolderNode = {
        id: generateId(),
        name: name.trim(),
        folders: [],
        repos: [],
      };

      parent.folders.push(newFolder);
      return newLibrary;
    });
  }, [library, findFolder]);

  const renameFolder = useCallback((folderId: string, newName: string) => {
    if (!newName.trim() || folderId === 'root' || !library) return;

    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const folder = findFolder(folderId, newLibrary.root);
      if (!folder) return prev;
      folder.name = newName.trim();
      return newLibrary;
    });
  }, [library, findFolder]);

  const deleteFolder = useCallback((folderId: string) => {
    if (folderId === 'root' || !library) return;

    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const parent = findParentFolder(folderId, newLibrary.root);
      if (!parent) return prev;
      parent.folders = parent.folders.filter((f) => f.id !== folderId);
      return newLibrary;
    });
  }, [library, findParentFolder]);

  const createRepo = useCallback((folderId: string, name: string, url: string) => {
    if (!name.trim() || !url.trim() || !library) return;

    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const folder = findFolder(folderId, newLibrary.root);
      if (!folder) return prev;

      const newRepo: RepoItem = {
        id: generateId(),
        name: name.trim(),
        url: url.trim(),
      };

      folder.repos.push(newRepo);
      return newLibrary;
    });
  }, [library, findFolder]);

  const updateRepo = useCallback((folderId: string, repoId: string, name: string, url: string) => {
    if (!name.trim() || !url.trim() || !library) return;

    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const folder = findFolder(folderId, newLibrary.root);
      if (!folder) return prev;

      const repo = folder.repos.find((r) => r.id === repoId);
      if (!repo) return prev;

      repo.name = name.trim();
      repo.url = url.trim();
      return newLibrary;
    });
  }, [library, findFolder]);

  const deleteRepo = useCallback((folderId: string, repoId: string) => {
    if (!library) return;
    
    setLibrary((prev) => {
      if (!prev) return prev;
      const newLibrary = structuredClone(prev);
      const folder = findFolder(folderId, newLibrary.root);
      if (!folder) return prev;
      folder.repos = folder.repos.filter((r) => r.id !== repoId);
      return newLibrary;
    });
  }, [library, findFolder]);

  return {
    library,
    isLoading,
    error,
    resetToSeed,
    importFromJson,
    createFolder,
    renameFolder,
    deleteFolder,
    createRepo,
    updateRepo,
    deleteRepo,
    findFolder,
  };
}
