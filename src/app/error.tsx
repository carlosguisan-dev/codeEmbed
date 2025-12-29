'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ServerCrash } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <ServerCrash className="w-24 h-24 text-destructive" />
      <h1 className="mt-8 text-4xl font-bold font-headline tracking-tight">¡Oops! Algo salió mal</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Lo sentimos, parece que ha ocurrido un error inesperado.
      </p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md text-center">
        {error.message || 'No se proporcionaron detalles adicionales del error.'}
      </p>
      <div className="mt-10">
        <Button onClick={() => reset()}>
          Intentar de nuevo
        </Button>
      </div>
    </div>
  )
}
