/**
 * Edit Split Dialog Component
 *
 * Dialog for editing workout split details (name, subtitle, exercises).
 * Client Component with React Hook Form.
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import type { WorkoutSplitWithExercises } from '../../types';

interface EditSplitDialogProps {
  split: WorkoutSplitWithExercises | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { name: string; subtitle?: string }) => Promise<void>;
}

export function EditSplitDialog({
  split,
  open,
  onOpenChange,
  onSave
}: EditSplitDialogProps) {
  const [name, setName] = useState(split?.name ?? '');
  const [subtitle, setSubtitle] = useState(split?.subtitle ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!split || !onSave) return;

    setIsSaving(true);
    try {
      await onSave({ name, subtitle: subtitle || undefined });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving split:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!split) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar División {split.splitLetter}</DialogTitle>
          <DialogDescription>
            Personaliza el nombre y descripción de tu división de entrenamiento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la división</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Piernas y Core"
              maxLength={100}
            />
            <p className="text-muted-foreground text-xs">
              {name.length}/100 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Descripción (opcional)</Label>
            <Textarea
              id="subtitle"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Ej: Enfoque en cuádriceps y glúteos"
              maxLength={200}
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              {subtitle.length}/200 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
