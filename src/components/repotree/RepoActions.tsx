import { useState } from 'react';
import type { RepoItem } from '../../types/reponest';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface RepoActionsProps {
  selectedFolderId: string | null;
  onCreateRepo: (name: string, url: string) => void;
  onEditRepo?: (repoId: string, name: string, url: string) => void;
  onDeleteRepo?: (repoId: string) => void;
  editingRepo?: RepoItem | null;
}

export function RepoActions({
  selectedFolderId,
  onCreateRepo,
  onEditRepo,
  onDeleteRepo,
  editingRepo,
}: RepoActionsProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [deletingRepo, setDeletingRepo] = useState<RepoItem | null>(null);

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

  const handleCreate = () => {
    if (!repoName.trim()) return;
    if (!validateUrl(repoUrl)) return;

    onCreateRepo(repoName.trim(), repoUrl.trim());
    setRepoName('');
    setRepoUrl('');
    setUrlError('');
    setCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!editingRepo || !onEditRepo) return;
    if (!repoName.trim()) return;
    if (!validateUrl(repoUrl)) return;

    onEditRepo(editingRepo.id, repoName.trim(), repoUrl.trim());
    setRepoName('');
    setRepoUrl('');
    setUrlError('');
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deletingRepo || !onDeleteRepo) return;
    onDeleteRepo(deletingRepo.id);
    setDeletingRepo(null);
    setDeleteDialogOpen(false);
  };

//   const openEditDialog = (repo: RepoItem) => {
//     setRepoName(repo.name);
//     setRepoUrl(repo.url);
//     setUrlError('');
//     setEditDialogOpen(true);
//   };

//   const openDeleteDialog = (repo: RepoItem) => {
//     setDeletingRepo(repo);
//     setDeleteDialogOpen(true);
//   };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => {
          setRepoName('');
          setRepoUrl('');
          setUrlError('');
          setCreateDialogOpen(true);
        }}
        disabled={!selectedFolderId}
      >
        <Plus className="w-4 h-4 mr-2" />
        Nuevo Repositorio
      </Button>

      {/* Create Repo Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Repositorio</DialogTitle>
            <DialogDescription>
              Agregar un repositorio de GitHub o GitLab
            </DialogDescription>
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
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              {urlError && <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!repoName.trim() || !repoUrl.trim()}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Repo Dialog */}
      {editingRepo && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                {urlError && <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit} disabled={!repoName.trim() || !repoUrl.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Repo Dialog */}
      {deletingRepo && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar repositorio?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará el repositorio "{deletingRepo.name}". Esta acción no se
                puede deshacer.
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
      )}
    </div>
  );
}

// Export helper functions for use in RepoList
export function EditRepoButton({
  repo,
  onEdit,
}: {
  repo: RepoItem;
  onEdit: (repo: RepoItem) => void;
}) {
  return (
    <Button size="sm" variant="ghost" onClick={() => onEdit(repo)}>
      <Pencil className="w-4 h-4" />
    </Button>
  );
}

export function DeleteRepoButton({
  repo,
  onDelete,
}: {
  repo: RepoItem;
  onDelete: (repo: RepoItem) => void;
}) {
  return (
    <Button size="sm" variant="ghost" onClick={() => onDelete(repo)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
