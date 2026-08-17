import {
  useCallback,
  useEffect,
  useState,
} from "react";

interface Item {
  id: string;
  nombre: string;
}

interface Props {
  titulo: string;
  getItems: () => Promise<Item[]>;
  createItem: (nombre: string) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export function CatalogoManager({
  titulo,
  getItems,
  createItem,
  deleteItem,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [nuevo, setNuevo] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setError("");

      const data = await getItems();

      setItems(data);
    } catch (error) {
      console.error(
        `Error cargando ${titulo}:`,
        error
      );

      setError(
        `No se pudieron cargar ${titulo.toLowerCase()}`
      );
    } finally {
      setLoading(false);
    }
  }, [getItems, titulo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  const handleAdd = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const nombre = nuevo.trim();

    if (!nombre || submitting) {
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await createItem(nombre);

      setNuevo("");

      await cargar();
    } catch (error) {
      console.error(
        `Error creando ${titulo}:`,
        error
      );

      setError(
        "Ya existe o ocurrió un error al crear el registro"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (submitting || deletingId) {
      return;
    }

    const item = items.find(
      (actual) => actual.id === id
    );

    const nombre = item?.nombre ?? "este registro";

    const confirmar = window.confirm(
      `¿Eliminar "${nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setDeletingId(id);

    try {
      await deleteItem(id);

      setItems((actuales) =>
        actuales.filter(
          (actual) => actual.id !== id
        )
      );
    } catch (error) {
      console.error(
        `Error eliminando ${titulo}:`,
        error
      );

      setError(
        "No se pudo eliminar el registro"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const nombreSingular = titulo
    .toLowerCase()
    .replace(/s$/, "");

  return (
    <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-medium text-stone-800 dark:text-stone-200">
          {titulo}
        </h3>

        <span className="font-mono text-xs text-stone-400 dark:text-stone-600">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-3 flex gap-1.5"
      >
        <input
          value={nuevo}
          onChange={(event) =>
            setNuevo(event.target.value)
          }
          placeholder={`Nuevo ${nombreSingular}`}
          disabled={submitting}
          className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-rose-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600 dark:focus:border-rose-500"
        />

        <button
          type="submit"
          disabled={
            submitting || !nuevo.trim()
          }
          className="shrink-0 rounded-lg bg-stone-900 px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-rose-500 dark:hover:text-white"
        >
          {submitting ? "…" : "+"}
        </button>
      </form>

      {error && (
        <p className="mb-2 rounded-md bg-rose-50 px-2.5 py-1.5 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-7 animate-pulse rounded-md bg-stone-100 dark:bg-stone-900"
              />
            )
          )}
        </div>
      ) : items.length === 0 ? (
        <p className="py-3 text-center text-xs text-stone-400 dark:text-stone-600">
          Sin registros todavía
        </p>
      ) : (
        <ul className="space-y-0.5">
          {items.map((item) => {
            const eliminando =
              deletingId === item.id;

            return (
              <li
                key={item.id}
                className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-900"
              >
                <span
                  className={
                    eliminando
                      ? "text-stone-400"
                      : ""
                  }
                >
                  {item.nombre}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  disabled={
                    deletingId !== null ||
                    submitting
                  }
                  aria-label={`Eliminar ${item.nombre}`}
                  className="text-stone-300 opacity-0 transition-all duration-150 hover:text-rose-800 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-stone-700 dark:hover:text-rose-500"
                >
                  {eliminando ? "…" : "✕"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}