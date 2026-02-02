export type RepoItem = {
  id: string;
  name: string;
  url: string;
};

export type FolderNode = {
  id: string;
  name: string;
  folders: FolderNode[];
  repos: RepoItem[];
};

export type RepoLibrary = {
  version: number;
  root: FolderNode;
};
