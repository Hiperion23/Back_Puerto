import { useRef, useState } from "react";
import { api } from "../../services/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

interface UploadResponse {
  path: string;
  url: string;
}

export function ImageUploader({
  value,
  onChange,
}: Props) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB");
      return;
    }

    setError("");
    setSubiendo(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const resultado = await api.upload<UploadResponse>(
        "/api/storage/upload",
        formData
      );

      onChange(resultado.url);
    } catch (error) {
      console.error("Error subiendo imagen:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al subir la imagen");
      }
    } finally {
      setSubiendo(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const abrirSelector = () => {
    if (subiendo) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div>
      {value && (
        <img
          src={value}
          alt="Vista previa"
          className="mb-2 h-24 w-24 rounded object-cover"
        />
      )}

      <button
        type="button"
        onClick={abrirSelector}
        disabled={subiendo}
        className="inline-block cursor-pointer rounded border border-stone-200 px-3 py-2 text-sm transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:hover:bg-stone-800"
      >
        {subiendo
          ? "Subiendo..."
          : value
            ? "Cambiar imagen"
            : "Subir imagen"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        disabled={subiendo}
        className="hidden"
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}