import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "../../services/api";
import type { Plato } from "../../types/plato";
import type {
  Categoria,
  Tag,
  Allergen,
} from "../../types/catalogo";

import { ImageUploader } from "./ImgUploader";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-rose-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600 dark:focus:border-rose-500";

const labelClass =
  "mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-400";

const sectionClass =
  "space-y-4 border-b border-stone-100 pb-8 dark:border-stone-900";

const eyebrowClass =
  "select-none font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-600";

function pillClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
    active
      ? "border-rose-800 bg-rose-800 text-white dark:border-rose-500 dark:bg-rose-500"
      : "border-stone-200 text-stone-600 hover:border-stone-300 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700"
  }`;
}

interface PlatoFormData {
  name: string;
  description: string;
  price: string;
  categoria_id: string;
  image: string;
  images: string[];
  tags: string[];
  ingredients: string;
  allergens: string[];
  disponible: boolean;
}

export function PlatoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plato, setPlato] = useState<Plato | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<PlatoFormData>({
    name: "",
    description: "",
    price: "",
    categoria_id: "",
    image: "",
    images: [],
    tags: [],
    ingredients: "",
    allergens: [],
    disponible: true,
  });

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [categoriasData, tagsData, allergensData] =
          await Promise.all([
            api.get<Categoria[]>("/api/categorias"),
            api.get<Tag[]>("/api/tags"),
            api.get<Allergen[]>("/api/allergens"),
          ]);

        setCategorias(categoriasData);
        setTags(tagsData);
        setAllergens(allergensData);
      } catch (error) {
        console.error("Error cargando catálogos:", error);
        setError("No se pudieron cargar los catálogos");
      }
    }

    cargarCatalogos();
  }, []);

  useEffect(() => {
    async function cargarPlato() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await api.get<Plato>(`/api/platos/${id}`);

        setPlato(data);

        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price:
            data.price !== null && data.price !== undefined
              ? String(data.price)
              : "",
          categoria_id: data.categoria_id ?? "",
          image: data.image ?? "",
          images: Array.isArray(data.images)
            ? data.images.filter(
                (image): image is string =>
                  typeof image === "string"
              )
            : [],
          tags: Array.isArray(data.tags)
            ? data.tags.filter(
                (tag): tag is string =>
                  typeof tag === "string"
              )
            : [],
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join(", ")
            : "",
          allergens: Array.isArray(data.allergens)
            ? data.allergens.filter(
                (allergen): allergen is string =>
                  typeof allergen === "string"
              )
            : [],
          disponible: data.disponible ?? true,
        });
      } catch (error) {
        console.error("Error cargando plato:", error);
        setError("No se pudo cargar el plato");
      } finally {
        setLoading(false);
      }
    }

    cargarPlato();
  }, [id]);

  const convertirLista = (value: string): string[] => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const actualizarCampo = <K extends keyof PlatoFormData>(
    campo: K,
    valor: PlatoFormData[K]
  ) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const toggleTag = (tagId: string) => {
    setForm((actual) => ({
      ...actual,
      tags: actual.tags.includes(tagId)
        ? actual.tags.filter((tag) => tag !== tagId)
        : [...actual.tags, tagId],
    }));
  };

  const toggleAllergen = (allergenId: string) => {
    setForm((actual) => ({
      ...actual,
      allergens: actual.allergens.includes(allergenId)
        ? actual.allergens.filter(
            (allergen) => allergen !== allergenId
          )
        : [...actual.allergens, allergenId],
    }));
  };

  const agregarImagenAdicional = (url: string) => {
    if (!url) return;

    setForm((actual) => ({
      ...actual,
      images: [...actual.images, url],
    }));
  };

  const eliminarImagenAdicional = (index: number) => {
    setForm((actual) => ({
      ...actual,
      images: actual.images.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("El nombre del plato es obligatorio");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("El precio no es válido");
      return;
    }

    if (!form.categoria_id) {
      setError("Debes seleccionar una categoría");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoria_id: form.categoria_id,
      image: form.image || null,
      images: form.images,
      tags: form.tags,
      ingredients: convertirLista(form.ingredients),
      allergens: form.allergens,
      disponible: form.disponible,
      orden: plato?.orden ?? null,
    };

    try {
      if (id) {
        await api.put(`/api/platos/${id}`, payload);
      } else {
        await api.post("/api/platos", payload);
      }

      navigate("/admin/platos");
    } catch (error) {
      console.error("Error guardando plato:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error al guardar el plato");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-100 dark:bg-stone-900" />

          <div className="h-8 w-64 animate-pulse rounded bg-stone-100 dark:bg-stone-900" />

          <div className="h-32 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-900" />

          <div className="h-32 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={() => navigate("/admin/platos")}
          className="mb-6 flex items-center gap-1.5 text-xs font-medium text-stone-400 transition-colors hover:text-stone-700 dark:text-stone-600 dark:hover:text-stone-300"
        >
          ← Volver a platos
        </button>

        <span className={eyebrowClass}>
          {id ? "Editar" : "Nuevo"}
        </span>

        <h2 className="mb-8 mt-1 font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          {id ? form.name || "Editar plato" : "Nuevo plato"}
        </h2>

        <div className={sectionClass}>
          <p className={eyebrowClass}>Información básica</p>

          <div>
            <label
              className={labelClass}
              htmlFor="name"
            >
              Nombre
            </label>

            <input
              id="name"
              value={form.name}
              onChange={(event) =>
                actualizarCampo(
                  "name",
                  event.target.value
                )
              }
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              className={labelClass}
              htmlFor="description"
            >
              Descripción
            </label>

            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(event) =>
                actualizarCampo(
                  "description",
                  event.target.value
                )
              }
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                className={labelClass}
                htmlFor="price"
              >
                Precio
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-stone-400 dark:text-stone-600">
                  S/
                </span>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    actualizarCampo(
                      "price",
                      event.target.value
                    )
                  }
                  className={`${inputClass} pl-9 font-mono tabular-nums`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={labelClass}
                htmlFor="categoria"
              >
                Categoría
              </label>

              <select
                id="categoria"
                value={form.categoria_id}
                onChange={(event) =>
                  actualizarCampo(
                    "categoria_id",
                    event.target.value
                  )
                }
                className={inputClass}
                required
              >
                <option value="">
                  Selecciona una categoría
                </option>

                {categorias.map((categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <p className={eyebrowClass}>Imágenes</p>

          <div>
            <label className={labelClass}>
              Imagen principal
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-2 text-center font-mono text-[10px] uppercase tracking-wider text-stone-300 dark:text-stone-700">
                    Vacío
                  </span>
                )}
              </div>

              <div className="flex-1">
                <ImageUploader
                  value={form.image}
                  onChange={(url) =>
                    actualizarCampo("image", url)
                  }
                />

                {form.image && (
                  <button
                    type="button"
                    onClick={() =>
                      actualizarCampo("image", "")
                    }
                    className="mt-2 text-xs font-medium text-stone-400 transition-colors hover:text-rose-800 dark:text-stone-600 dark:hover:text-rose-500"
                  >
                    Quitar imagen principal
                  </button>
                )}

                <p className="mt-1.5 text-xs text-stone-400 dark:text-stone-600">
                  Se usa como portada del plato en el menú.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Imágenes adicionales
            </label>

            <div className="flex flex-wrap gap-2.5">
              {form.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt={`${form.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      eliminarImagenAdicional(index)
                    }
                    aria-label="Quitar imagen"
                    className="absolute inset-0 flex items-center justify-center bg-stone-900/0 text-transparent transition-all duration-150 group-hover:bg-stone-900/50 group-hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                <ImageUploader
                  value=""
                  onChange={agregarImagenAdicional}
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-stone-400 dark:text-stone-600">
              Puedes agregar varias imágenes adicionales.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <p className={eyebrowClass}>Tags</p>

          {tags.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-600">
              No hay tags registrados.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={pillClass(
                    form.tags.includes(tag.id)
                  )}
                >
                  {tag.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={sectionClass}>
          <p className={eyebrowClass}>Ingredientes</p>

          <input
            value={form.ingredients}
            onChange={(event) =>
              actualizarCampo(
                "ingredients",
                event.target.value
              )
            }
            className={inputClass}
            placeholder="Ej. pescado, limón, cebolla, ají"
          />

          <p className="text-xs text-stone-400 dark:text-stone-600">
            Separa cada ingrediente utilizando una coma.
          </p>
        </div>

        <div className={sectionClass}>
          <p className={eyebrowClass}>Alérgenos</p>

          {allergens.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-600">
              No hay alérgenos registrados.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen) => (
                <button
                  key={allergen.id}
                  type="button"
                  onClick={() =>
                    toggleAllergen(allergen.id)
                  }
                  className={pillClass(
                    form.allergens.includes(allergen.id)
                  )}
                >
                  {allergen.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-6">
          <div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
              Disponible
            </p>

            <p className="text-xs text-stone-400 dark:text-stone-600">
              Se muestra en el menú cuando está activo.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.disponible}
            onClick={() =>
              actualizarCampo(
                "disponible",
                !form.disponible
              )
            }
            className={`relative flex h-7 w-14 items-center rounded-full px-1 transition-colors duration-300 ${
              form.disponible
                ? "bg-rose-800 dark:bg-rose-500"
                : "bg-stone-200 dark:bg-stone-800"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                form.disponible
                  ? "translate-x-7"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-rose-500 dark:hover:text-white"
          >
            {saving
              ? "Guardando…"
              : id
                ? "Guardar cambios"
                : "Crear plato"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/platos")}
            disabled={saving}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors duration-200 hover:border-stone-300 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:text-stone-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}