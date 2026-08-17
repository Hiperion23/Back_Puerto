import { CatalogoManager } from "./Catalogo";
import {
  getCategorias,
  createCategoria,
  deleteCategoria,
} from "../../services/categorias";
import {
  getTags,
  createTag,
  deleteTag,
} from "../../services/tags";
import {
  getAllergens,
  createAllergen,
  deleteAllergen,
} from "../../services/allergens";

export function Configuracion() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-600">
          Administración
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Configuración
        </h1>

        <p className="mt-2 max-w-xl text-sm text-stone-500 dark:text-stone-400">
          Administra las categorías, tags y alérgenos
          disponibles para los platos del menú.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <CatalogoManager
          titulo="Categorías"
          getItems={getCategorias}
          createItem={createCategoria}
          deleteItem={deleteCategoria}
        />

        <CatalogoManager
          titulo="Tags"
          getItems={getTags}
          createItem={createTag}
          deleteItem={deleteTag}
        />

        <CatalogoManager
          titulo="Alérgenos"
          getItems={getAllergens}
          createItem={createAllergen}
          deleteItem={deleteAllergen}
        />
      </div>
    </main>
  );
}