import { useState } from 'react';
import type { FolderNode } from '../../types/reponest';
import { TreeNode } from './TreeNode';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface TreeProps {
  root: FolderNode;
  onCreateFolder: (parentId: string, name: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onCreateRepo: (folderId: string, name: string, url: string) => void;
  onUpdateRepo: (folderId: string, repoId: string, name: string, url: string) => void;
  onDeleteRepo: (folderId: string, repoId: string) => void;
}

type DialogType = 'folder' | 'repo' | 'rename-folder' | 'rename-repo' | null;
type DeleteTarget = { type: 'folder' | 'repo'; id: string; parentId?: string; name: string } | null;
type EditRepoData = { folderId: string; repoId: string; name: string; url: string } | null;

export function Tree({
  root,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onCreateRepo,
  onUpdateRepo,
  onDeleteRepo,
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [editRepoData, setEditRepoData] = useState<EditRepoData>(null);
  const [folderName, setFolderName] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('La URL es requerida');
      return false;
    }
    if (!url.startsWith('https://github.com/') && !url.startsWith('https://gitlab.com/')) {
      setUrlError('La URL debe comenzar con https://github.com/ o https://gitlab.com/');
      return false;
    }
    setUrlError('');
    return true;
  };

  const openCreateFolderDialog = (parentId: string) => {
    setActiveNodeId(parentId);
    setFolderName('');
    setDialogType('folder');
  };

  const openCreateRepoDialog = (folderId: string) => {
    setActiveNodeId(folderId);
    setRepoName('');
    setRepoUrl('');
    setUrlError('');
    setDialogType('repo');
  };

  const openRenameFolderDialog = (folderId: string, currentName: string) => {
    setActiveNodeId(folderId);
    setFolderName(currentName);
    setDialogType('rename-folder');
  };

  const openRenameRepoDialog = (folderId: string, repoId: string, currentName: string, currentUrl: string) => {
    setEditRepoData({ folderId, repoId, name: currentName, url: currentUrl });
    setRepoName(currentName);
    setRepoUrl(currentUrl);
    setUrlError('');
    setDialogType('rename-repo');
  };

  const openDeleteDialog = (type: 'folder' | 'repo', id: string, name: string, parentId?: string) => {
    setDeleteTarget({ type, id, name, parentId });
  };

  const handleCreateFolder = () => {
    if (!activeNodeId || !folderName.trim()) return;
    onCreateFolder(activeNodeId, folderName.trim());
    setDialogType(null);
    setFolderName('');
  };

  const handleCreateRepo = () => {
    if (!activeNodeId || !repoName.trim() || !validateUrl(repoUrl)) return;
    onCreateRepo(activeNodeId, repoName.trim(), repoUrl.trim());
    setDialogType(null);
    setRepoName('');
    setRepoUrl('');
  };

  const handleRenameFolder = () => {
    if (!activeNodeId || !folderName.trim()) return;
    onRenameFolder(activeNodeId, folderName.trim());
    setDialogType(null);
    setFolderName('');
  };

  const handleRenameRepo = () => {
    if (!editRepoData || !repoName.trim() || !validateUrl(repoUrl)) return;
    onUpdateRepo(editRepoData.folderId, editRepoData.repoId, repoName.trim(), repoUrl.trim());
    setDialogType(null);
    setRepoName('');
    setRepoUrl('');
    setEditRepoData(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'folder') {
      onDeleteFolder(deleteTarget.id);
    } else {
      onDeleteRepo(deleteTarget.parentId!, deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const toggleSelection = (id: string, type: 'folder' | 'repo', parentId?: string) => {
    const itemKey = type === 'folder' ? `folder:${id}` : `repo:${parentId}:${id}`;
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const handleDeleteMultiple = () => {
    selectedItems.forEach(itemKey => {
      if (itemKey.startsWith('folder:')) {
        const folderId = itemKey.replace('folder:', '');
        if (folderId !== 'root') {
          onDeleteFolder(folderId);
        }
      } else if (itemKey.startsWith('repo:')) {
        const [, parentId, repoId] = itemKey.split(':');
        onDeleteRepo(parentId, repoId);
      }
    });
    setSelectedItems(new Set());
  };

  return (
    <>
      <Card className="p-4">
        {selectedItems.size > 0 && (
          <div className="mb-4 flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedItems.size} elemento{selectedItems.size !== 1 ? 's' : ''} seleccionado{selectedItems.size !== 1 ? 's' : ''}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMultiple}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar seleccionados
            </Button>
          </div>
        )}
        <div className="space-y-2">
          <TreeNode
            node={root}
            depth={0}
            expandedIds={expandedIds}
            selectedItems={selectedItems}
            onToggle={handleToggle}
            onToggleSelection={toggleSelection}
            onCreateFolder={openCreateFolderDialog}
            onCreateRepo={openCreateRepoDialog}
            onRenameFolder={openRenameFolderDialog}
            onRenameRepo={openRenameRepoDialog}
            onDeleteFolder={(id, name) => openDeleteDialog('folder', id, name)}
            onDeleteRepo={(folderId, repoId, name) => openDeleteDialog('repo', repoId, name, folderId)}
          />
        </div>
      </Card>

      {/* Create Folder Dialog */}
      <Dialog open={dialogType === 'folder'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Carpeta</DialogTitle>
            <DialogDescription>Crear una nueva carpeta</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Nombre</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ej: Frontend Projects"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Repo Dialog */}
      <Dialog open={dialogType === 'repo'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Repositorio</DialogTitle>
            <DialogDescription>Agregar un repositorio de GitHub o GitLab</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Nombre</Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="Ej: Frontend App"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-url">URL</Label>
              <Input
                id="repo-url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setUrlError('');
                }}
                placeholder="https://github.com/user/repo"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRepo()}
              />
              {urlError && <p className="text-sm text-destructive">{urlError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateRepo} disabled={!repoName.trim() || !repoUrl.trim()}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={dialogType === 'rename-folder'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Carpeta</DialogTitle>
            <DialogDescription>Cambiar el nombre de la carpeta</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-folder">Nombre</Label>
              <Input
                id="rename-folder"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameFolder} disabled={!folderName.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Repo Dialog */}
      <Dialog open={dialogType === 'rename-repo'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Repositorio</DialogTitle>
            <DialogDescription>Modificar la información del repositorio</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-repo-name">Nombre</Label>
              <Input
                id="edit-repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-repo-url">URL</Label>
              <Input
                id="edit-repo-url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setUrlError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameRepo()}
              />
              {urlError && <p className="text-sm text-destructive">{urlError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameRepo} disabled={!repoName.trim() || !repoUrl.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar {deleteTarget?.type === 'folder' ? 'carpeta' : 'repositorio'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará "{deleteTarget?.name}"{deleteTarget?.type === 'folder' ? ' y todo su contenido' : ''}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
