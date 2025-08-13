import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldValues } from "react-hook-form";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
};

export function MiniTimerSection<TFieldValues extends FieldValues = FieldValues>({ control }: Props<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={"miniTimerText" as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Mini Timer Text</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Enter mini timer text"
              className="bg-zinc-800 text-white border-zinc-700"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


