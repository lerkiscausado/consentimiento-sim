# Ejemplos de consumo de la API `/api/dashboard/reporte`

## 1. Ejemplo básico con fetch (método tradicional)

```typescript
const consecutivo = 29321;

fetch(`/api/dashboard/reporte?consecutivo=${consecutivo}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.ok) {
      console.log("PDF obtenido:", data.data.pdf);
      // Aquí puedes procesar el PDF
    } else {
      console.error("Error:", data.message);
    }
  })
  .catch((error) => {
    console.error("Error al conectar:", error);
  });
```

## 2. Ejemplo con async/await

```typescript
async function obtenerReporte(consecutivo: number) {
  try {
    const response = await fetch(`/api/dashboard/reporte?consecutivo=${consecutivo}`);
    const data = await response.json();
    
    if (data.ok) {
      return data.data.pdf;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    throw error;
  }
}

// Uso:
const pdf = await obtenerReporte(29321);
```

## 3. Ejemplo con URLSearchParams (más limpio)

```typescript
const consecutivo = 29321;
const params = new URLSearchParams({ consecutivo: String(consecutivo) });

fetch(`/api/dashboard/reporte?${params}`)
  .then((r) => r.json())
  .then((json) => {
    if (json.ok) {
      console.log("PDF:", json.data.pdf);
    } else {
      console.error("Error:", json.message);
    }
  });
```

## 4. Ejemplo completo en un componente React (con manejo de estados)

```typescript
"use client";

import { useState } from "react";

export function DescargarReporte({ consecutivo }: { consecutivo: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargarReporte = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/reporte?consecutivo=${consecutivo}`);
      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.message || "Error al obtener el reporte");
      }

      // Si el PDF viene como base64
      if (data.data.pdf) {
        // Crear un blob desde base64
        const byteCharacters = atob(data.data.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Crear URL y descargar
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-${consecutivo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setError(err.message || "Error al descargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={descargarReporte}
        disabled={loading}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-portal-primary text-white hover:bg-portal-primary/90 disabled:opacity-50"
      >
        {loading ? "Descargando..." : "Descargar PDF"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

## 5. Ejemplo con useEffect (cargar al montar el componente)

```typescript
"use client";

import { useEffect, useState } from "react";

export function VerReporte({ consecutivo }: { consecutivo: number }) {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ consecutivo: String(consecutivo) });
    
    fetch(`/api/dashboard/reporte?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setPdfData(json.data.pdf);
        } else {
          setError(json.message || "Error al cargar el reporte");
        }
      })
      .catch((err) => {
        setError("Error al conectar con el servidor");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [consecutivo]);

  if (loading) return <p>Cargando reporte...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!pdfData) return <p>No hay PDF disponible</p>;

  // Mostrar el PDF en un iframe
  return (
    <iframe
      src={`data:application/pdf;base64,${pdfData}`}
      width="100%"
      height="600px"
      title="Reporte PDF"
    />
  );
}
```

## 6. Ejemplo con hook personalizado

```typescript
"use client";

import { useState, useEffect } from "react";

function useReporte(consecutivo: number | null) {
  const [pdf, setPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!consecutivo) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ consecutivo: String(consecutivo) });
    fetch(`/api/dashboard/reporte?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setPdf(json.data.pdf);
        } else {
          setError(json.message);
        }
      })
      .catch((err) => {
        setError("Error al conectar");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [consecutivo]);

  return { pdf, loading, error };
}

// Uso del hook:
export function MiComponente() {
  const { pdf, loading, error } = useReporte(29321);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pdf) return <p>No hay PDF</p>;

  return <iframe src={`data:application/pdf;base64,${pdf}`} />;
}
```

## Notas importantes:

1. **Autenticación**: La API requiere que el usuario esté autenticado (cookie de sesión)
2. **Parámetro `consecutivo`**: Es el número de consecutivo de la orden (ej: 29321)
3. **Formato del PDF**: El PDF viene en el campo `data.pdf` de la respuesta
4. **Manejo de errores**: Siempre verifica `data.ok` antes de usar los datos
5. **Base64**: Si el PDF viene como base64, usa `atob()` para decodificarlo antes de crear el Blob
