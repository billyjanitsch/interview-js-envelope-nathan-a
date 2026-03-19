import { SortIcon } from "../../icons.tsx";

export type SortField = "amount" | "date" | "description" | "envelope";

export function SortButton({
  activeField,
  children,
  field,
  onSort,
}: {
  activeField: SortField;
  children: React.ReactNode;
  field: SortField;
  onSort: (field: SortField) => void;
}) {
  return (
    <button
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1"
    >
      {children}
      <span className={activeField === field ? "text-ink" : "text-ink-faint"}>
        <SortIcon />
      </span>
    </button>
  );
}
