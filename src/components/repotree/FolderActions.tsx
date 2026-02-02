import { useState } from 'react';
import type { FolderNode } from '../../types/reponest';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { FolderPlus, Pencil, Trash2 } from 'lucide-react';

interface FolderActionsProps {
  selectedFolder: FolderNode | null;
  onCreateFolder: (name: string) => void;
  onRenameFolder: (name: string) => void;
  onDeleteFolder: () => void;
}

export function FolderActions({
  selectedFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: FolderActionsProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const isRoot = selectedFolder?.id === 'root';
  const hasContent =
    selectedFolder &&
    (selectedFolder.folders.length > 0 || selectedFolder.repos.length > 0);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      setCreateDialogOpen(false);
    }
  };

  const handleRename = () => {
    if (folderName.trim()) {
      onRenameFolder(folderName.trim());
      setFolderName('');
      setRenameDialogOpen(false);
    }
  };

  const handleDelete = () => {
    onDeleteFolder();
    setDeleteDialogOpen(false);
  };

  const openRenameDialog = () => {
    if (selectedFolder) {
      setFolderName(selectedFolder.name);
      setRenameDialogOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setCreateDialogOpen(true)}
        disabled={!selectedFolder}
      >
        <FolderPlus className="w-4 h-4 mr-2" />
        Nueva Carpeta
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={openRenameDialog}
        disabled={!selectedFolder || isRoot}
      >
        <Pencil className="w-4 h-4 mr-2" />
        Renombrar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setDeleteDialogOpen(true)}
        disabled={!selectedFolder || isRoot}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Eliminar
      </Button>

      {/* Create Folder Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Carpeta</DialogTitle>
            <DialogDescription>
              Crear una nueva carpeta dentro de "{selectedFolder?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Nombre</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ej: Frontend Projects"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!folderName.trim()}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Carpeta</DialogTitle>
            <DialogDescription>
              Cambiar el nombre de la carpeta "{selectedFolder?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-folder">Nombre</Label>
              <Input
                id="rename-folder"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename} disabled={!folderName.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar carpeta?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasContent
                ? `Esta acción eliminará la carpeta "${selectedFolder?.name}" y todo su contenido (subcarpetas y repositorios). Esta acción no se puede deshacer.`
                : `Esta acción eliminará la carpeta "${selectedFolder?.name}". Esta acción no se puede deshacer.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
