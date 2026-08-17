import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getPlatos,
  deletePlato,
} from "../../services/platos";

import type { Plato } from "../../types/plato";

import { useNavigate } from "react-router-dom";

export function PlatosList() {
  const [platos, setPlatos] =
    useState<Plato[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const cargarPlatos = useCallback(async () => {
  try {
    const data = await getPlatos();
    setPlatos(data);
    setError(""); // ya no es síncrono respecto al efecto
  } catch (error) {
    console.error("Error cargando platos:", error);
    setError("No se pudieron cargar los platos.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón intenciona
    cargarPlatos();
  }, [cargarPlatos]);

  const handleDelete =
    async (id: string) => {
      if (
        !window.confirm(
          "¿Eliminar este plato?"
        )
      ) {
        return;
      }

      try {
        setError("");

        await deletePlato(id);

        setPlatos((actuales) =>
          actuales.filter(
            (plato) =>
              plato.id !== id
          )
        );
      } catch (error) {
        console.error(
          "Error eliminando plato:",
          error
        );

        setError(
          "No se pudo eliminar el plato."
        );
      }
    };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-stone-400">
            Menú
          </p>

          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              Platos
            </h1>

            <span className="font-mono text-xs text-stone-400">
              {String(
                platos.length
              ).padStart(2, "0")}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/platos/nuevo"
            )
          }
          className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-rose-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-rose-500 dark:hover:text-white"
        >
          + Nuevo plato
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({
            length: 4,
          }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded bg-stone-100 dark:bg-stone-900"
            />
          ))}
        </div>
      ) : platos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-200 py-16 text-center dark:border-stone-800">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Todavía no hay platos
            en el menú.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/platos/nuevo"
              )
            }
            className="mt-3 text-sm font-medium text-rose-800 hover:underline dark:text-rose-500"
          >
            Agregar el primero →
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {[
                  "",
                  "Nombre",
                  "Categoría",
                  "Precio",
                  "Disponible",
                  "",
                ].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="border-b border-stone-200 pb-2 font-mono text-[11px] font-normal uppercase tracking-wider text-stone-400 dark:border-stone-800 dark:text-stone-600"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {platos.map(
                (plato) => (
                  <tr
                    key={plato.id}
                    className="border-b border-stone-100 transition-colors hover:bg-stone-50 dark:border-stone-900 dark:hover:bg-stone-900/60"
                  >
                    <td className="py-3">
                      {plato.image ? (
                        <img
                          src={
                            plato.image
                          }
                          alt={
                            plato.name
                          }
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-stone-100 dark:bg-stone-800" />
                      )}
                    </td>

                    <td className="font-medium text-stone-800 dark:text-stone-100">
                      {plato.name}
                    </td>

                    <td className="text-stone-500 dark:text-stone-400">
                      {plato.categoria
                        ?.nombre ? (
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                          {
                            plato
                              .categoria
                              .nombre
                          }
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="font-mono tabular-nums text-stone-800 dark:text-stone-200">
                      S/{" "}
                      {plato.price}
                    </td>

                    <td>
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          plato.disponible
                            ? "bg-rose-800 dark:bg-rose-500"
                            : "bg-stone-300 dark:bg-stone-700"
                        }`}
                        title={
                          plato.disponible
                            ? "Disponible"
                            : "No disponible"
                        }
                      />
                    </td>

                    <td className="space-x-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/platos/${plato.id}/editar`
                          )
                        }
                        className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            plato.id
                          )
                        }
                        className="text-xs font-medium text-stone-500 hover:text-rose-800 dark:text-stone-400 dark:hover:text-rose-500"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}