import { useState } from 'react';
import { useRepoLibrary } from '../hooks/useRepoLibrary';
import { Tree } from '../components/repotree/Tree';
import { ThemeToggle } from '../components/repotree/ThemeToggle';
import { Button } from '../components/ui/button';
import { RotateCcw, FileJson } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';

export function RepoNestApp() {
  const {
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
  } = useRepoLibrary();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState('');

  const handleReset = () => {
    resetToSeed();
    setResetDialogOpen(false);
  };

  const handleImport = () => {
    setImportError('');
    if (!jsonInput.trim()) {
      setImportError('El JSON no puede estar vacío');
      return;
    }
    const success = importFromJson(jsonInput);
    if (success) {
      setImportDialogOpen(false);
      setJsonInput('');
    } else {
      setImportError('JSON inválido. Verifica el formato.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Error al cargar los datos'}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">RepoTree</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Organiza tus repositorios de GitHub en carpetas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Importar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetDialogOpen(true)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-auto p-6">
          <Tree
            root={library.root}
            onCreateFolder={createFolder}
            onRenameFolder={renameFolder}
            onDeleteFolder={deleteFolder}
            onCreateRepo={createRepo}
            onUpdateRepo={updateRepo}
            onDeleteRepo={deleteRepo}
          />
        </div>
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar datos iniciales?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción restaurará todos los datos a la configuración inicial del seed.
              Perderás todos los cambios realizados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Restaurar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar JSON</DialogTitle>
            <DialogDescription>
              Pega tu JSON completo de biblioteca. Esto reemplazará todos los datos actuales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON</Label>
              <textarea
                id="json-input"
                className="w-full h-64 p-3 rounded-md border bg-background font-mono text-sm"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"version":1,"root":{"id":"root","name":"Root","folders":[],"repos":[]}}'
              />
              {importError && (
                <p className="text-sm text-destructive">{importError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImport}>
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
