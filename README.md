# 🌳 RepoTree

Una mini-aplicación para organizar repositorios de GitHub/GitLab en una estructura de carpetas tipo árbol.

## 🎯 Características

- 📁 **Gestión de Carpetas**: Crea, renombra y elimina carpetas con estructura anidada
- 🔗 **Gestión de Repositorios**: Agrega, edita y elimina repositorios de GitHub/GitLab
- 💾 **Persistencia Local**: Todos los datos se guardan automáticamente en localStorage
- 🌓 **Modo Claro/Oscuro**: Alterna entre temas con persistencia de preferencia
- 🔄 **Reset to Seed**: Restaura los datos iniciales cuando lo necesites
- ✨ **UI Moderna**: Construida con shadcn/ui y Tailwind CSS
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   └── RepoNestApp.tsx          # Componente principal de la aplicación
├── components/
│   ├── repotree/
│   │   ├── Tree.tsx             # Componente del árbol de carpetas
│   │   ├── TreeNode.tsx         # Nodo recursivo del árbol
│   │   ├── RepoList.tsx         # Lista de repositorios
│   │   ├── FolderActions.tsx    # Acciones de carpetas (crear, renombrar, eliminar)
│   │   ├── RepoActions.tsx      # Acciones de repos (crear, editar, eliminar)
│   │   └── ThemeToggle.tsx      # Toggle de tema claro/oscuro
│   └── ui/                      # Componentes de shadcn/ui
├── data/
│   └── repos.seed.json          # Datos iniciales de ejemplo
├── hooks/
│   ├── useRepoLibrary.ts        # Hook para gestión de datos
│   └── useTheme.ts              # Hook para gestión de tema
├── lib/
│   └── utils.ts                 # Utilidades (cn function)
└── types/
    └── reponest.ts              # Definiciones de tipos TypeScript
```

## 📦 Modelo de Datos

### RepoItem
```typescript
type RepoItem = {
  id: string;
  name: string;
  url: string;
};
```

### FolderNode
```typescript
type FolderNode = {
  id: string;
  name: string;
  folders: FolderNode[];  // Carpetas anidadas
  repos: RepoItem[];       // Repositorios en esta carpeta
};
```

### RepoLibrary
```typescript
type RepoLibrary = {
  version: number;
  root: FolderNode;
};
```

## 🎨 Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos
- **localStorage** - Persistencia de datos

## ✅ Validaciones

- ✓ El nombre de carpeta no puede estar vacío
- ✓ El nombre de repositorio no puede estar vacío  
- ✓ La URL debe comenzar con `https://github.com/` o `https://gitlab.com/`
- ✓ La carpeta Root no se puede renombrar ni eliminar
- ✓ Al eliminar una carpeta con contenido, se pide confirmación

## 🎯 Funcionalidades

### Carpetas
- **Crear**: Click en "Nueva Carpeta" con una carpeta seleccionada
- **Renombrar**: Click en "Renombrar" (excepto Root)
- **Eliminar**: Click en "Eliminar" (excepto Root, pide confirmación si tiene contenido)
- **Expandir/Colapsar**: Click en el chevron o en el nombre de la carpeta

### Repositorios
- **Agregar**: Click en "Nuevo Repositorio" con una carpeta seleccionada
- **Editar**: Click en el ícono de lápiz en la tarjeta del repo
- **Eliminar**: Click en el ícono de basura en la tarjeta del repo
- **Abrir**: Click en el enlace URL para abrir en nueva pestaña

### Persistencia
- Guardado automático en localStorage ante cada cambio
- Al abrir la app, carga datos desde localStorage
- Si no hay datos, carga desde `repos.seed.json`
- Botón "Reset to Seed" para restaurar datos iniciales

## 🌓 Modo Claro/Oscuro

El tema se aplica a través de la clase `light` o `dark` en el elemento `<html>`.
La preferencia se guarda en localStorage y persiste entre sesiones.

## 🔮 Futuras Mejoras

- 🏷️ Tags para repositorios
- 🔍 Búsqueda de repositorios
- 📊 Estadísticas de repos
- 🔄 Sincronización con API de GitHub
- 📤 Exportar/Importar configuración
- 🎨 Temas personalizados
- ⌨️ Atajos de teclado

## 📄 Licencia

MIT

---

Creado con ❤️ usando React + TypeScript + Vite

