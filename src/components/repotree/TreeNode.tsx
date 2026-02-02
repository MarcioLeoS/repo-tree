import type { FolderNode, RepoItem } from '../../types/reponest';
import { ChevronRight, Folder, FolderOpen, FolderPlus, FilePlus, Pencil, Trash2, GitBranch, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

interface TreeNodeProps {
  node: FolderNode;
  depth: number;
  expandedIds: Set<string>;
  selectedItems: Set<string>;
  onToggle: (id: string) => void;
  onToggleSelection: (id: string, type: 'folder' | 'repo', parentId?: string) => void;
  onCreateFolder: (parentId: string) => void;
  onCreateRepo: (folderId: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onRenameRepo: (folderId: string, repoId: string, name: string, url: string) => void;
  onDeleteFolder: (folderId: string, name: string) => void;
  onDeleteRepo: (folderId: string, repoId: string, name: string) => void;
}

export function TreeNode({
  node,
  depth,
  expandedIds,
  selectedItems,
  onToggle,
  onToggleSelection,
  onCreateFolder,
  onCreateRepo,
  onRenameFolder,
  onRenameRepo,
  onDeleteFolder,
  onDeleteRepo,
}: TreeNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isRoot = node.id === 'root';
  const hasChildren = node.folders.length > 0 || node.repos.length > 0;
  const isSelected = selectedItems.has(`folder:${node.id}`);

  return (
    <div>
      {/* Folder Row */}
      <div
        className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Checkbox */}
        {!isRoot && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(node.id, 'folder')}
            className="h-4 w-4"
          />
        )}
        {isRoot && <div className="h-4 w-4" />}

        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 cursor-pointer"
            onClick={() => onToggle(node.id)}
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </Button>
        ) : (
          <div className="h-5 w-5" />
        )}

        {/* Folder Icon */}
        <div onClick={() => hasChildren && onToggle(node.id)} className="cursor-pointer">
          {isExpanded ? (
            <FolderOpen className="h-5 w-5 text-yellow-500" />
          ) : (
            <Folder className="h-5 w-5 text-yellow-600" />
          )}
        </div>

        {/* Folder Name */}
        <span
          className={`flex-1 text-sm truncate ${isRoot ? 'font-semibold' : ''}`}
          onClick={() => hasChildren && onToggle(node.id)}
        >
          {node.name}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer"
            onClick={() => onCreateFolder(node.id)}
            title="Nueva carpeta"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer"
            onClick={() => onCreateRepo(node.id)}
            title="Nuevo repositorio"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </Button>
          {!isRoot && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
                onClick={() => onRenameFolder(node.id, node.name)}
                title="Renombrar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive cursor-pointer"
                onClick={() => onDeleteFolder(node.id, node.name)}
                title="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {isExpanded && (
        <>
          {/* Child Folders */}
          {node.folders.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedItems={selectedItems}
              onToggle={onToggle}
              onToggleSelection={onToggleSelection}
              onCreateFolder={onCreateFolder}
              onCreateRepo={onCreateRepo}
              onRenameFolder={onRenameFolder}
              onRenameRepo={onRenameRepo}
              onDeleteFolder={onDeleteFolder}
              onDeleteRepo={onDeleteRepo}
            />
          ))}

          {/* Repos */}
          {node.repos.map((repo) => (
            <RepoRow
              key={repo.id}
              repo={repo}
              folderId={node.id}
              depth={depth + 1}
              selectedItems={selectedItems}
              onToggleSelection={onToggleSelection}
              onRename={(repoId, name, url) => onRenameRepo(node.id, repoId, name, url)}
              onDelete={(repoId, name) => onDeleteRepo(node.id, repoId, name)}
            />
          ))}
        </>
      )}
    </div>
  );
}

interface RepoRowProps {
  repo: RepoItem;
  folderId: string;
  depth: number;
  selectedItems: Set<string>;
  onToggleSelection: (id: string, type: 'folder' | 'repo', parentId?: string) => void;
  onRename: (repoId: string, name: string, url: string) => void;
  onDelete: (repoId: string, name: string) => void;
}

function RepoRow({ repo, folderId, depth, selectedItems, onToggleSelection, onRename, onDelete }: RepoRowProps) {
  const isSelected = selectedItems.has(`repo:${folderId}:${repo.id}`);
  
  return (
    <div
      className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50"
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelection(repo.id, 'repo', folderId)}
        className="h-4 w-4"
      />
      
      <div className="h-5 w-5" />
      
      {/* Repo Icon */}
      <GitBranch className="h-4 w-4 text-blue-600 shrink-0" />

      {/* Repo Name */}
      <span className="flex-1 text-sm truncate">{repo.name}</span>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-pointer"
          onClick={() => window.open(repo.url, '_blank')}
          title="Abrir en GitHub"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-pointer"
          onClick={() => onRename(repo.id, repo.name, repo.url)}
          title="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive cursor-pointer"
          onClick={() => onDelete(repo.id, repo.name)}
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
