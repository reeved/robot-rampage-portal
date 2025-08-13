import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { Control, FieldValues } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
};

export function BracketsSection<TFieldValues extends FieldValues = FieldValues>({ control }: Props<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({ control, name: "brackets" as any });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white text-lg font-semibold">Brackets Configuration</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", size: 8 } as any)}
          className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bracket
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-end p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <FormField
            control={control}
            name={`brackets.${index}.name` as any}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-white">Bracket Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Championship, Consolation"
                    className="bg-zinc-700 text-white border-zinc-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`brackets.${index}.size` as any}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel className="text-white">Size</FormLabel>
                <FormControl>
                  <Select value={String(field.value)} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <SelectTrigger className="bg-zinc-700 text-white border-zinc-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 text-white">
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
            className="bg-red-900 text-red-200 border-red-700 hover:bg-red-800 px-3"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
          <p>No brackets configured</p>
          <p className="text-sm">Click "Add Bracket" to get started</p>
        </div>
      )}
    </div>
  );
}


