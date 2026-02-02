import { useState } from 'react';
import type { RepoItem } from '../../types/reponest';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
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
import { GitBranch, Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';

interface RepoListProps {
  repos: RepoItem[];
  folderName: string;
  onEditRepo: (repoId: string, name: string, url: string) => void;
  onDeleteRepo: (repoId: string) => void;
}

export function RepoList({ repos, folderName, onEditRepo, onDeleteRepo }: RepoListProps) {
  const [editingRepo, setEditingRepo] = useState<RepoItem | null>(null);
  const [deletingRepo, setDeletingRepo] = useState<RepoItem | null>(null);
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [urlError, setUrlError] = useState('');

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

  const openEditDialog = (repo: RepoItem) => {
    setEditingRepo(repo);
    setRepoName(repo.name);
    setRepoUrl(repo.url);
    setUrlError('');
  };

  const handleEdit = () => {
    if (!editingRepo) return;
    if (!repoName.trim()) return;
    if (!validateUrl(repoUrl)) return;

    onEditRepo(editingRepo.id, repoName.trim(), repoUrl.trim());
    setEditingRepo(null);
    setRepoName('');
    setRepoUrl('');
    setUrlError('');
  };

  const handleDelete = () => {
    if (!deletingRepo) return;
    onDeleteRepo(deletingRepo.id);
    setDeletingRepo(null);
  };

  if (repos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No hay repositorios en "{folderName}"</p>
          <p className="text-xs mt-1">Usa el botón de arriba para agregar uno</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Card key={repo.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">
                      {repo.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(repo)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingRepo(repo)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mt-2"
              >
                <LinkIcon className="w-3 h-3" />
                <span className="truncate">{repo.url}</span>
              </a>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Edit Dialog */}
      {editingRepo && (
        <Dialog open={!!editingRepo} onOpenChange={() => setEditingRepo(null)}>
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
              <Button variant="ghost" onClick={() => setEditingRepo(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit} disabled={!repoName.trim() || !repoUrl.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deletingRepo && (
        <AlertDialog open={!!deletingRepo} onOpenChange={() => setDeletingRepo(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar repositorio?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará el repositorio "{deletingRepo.name}". Esta acción no se puede
                deshacer.
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
    </>
  );
}
