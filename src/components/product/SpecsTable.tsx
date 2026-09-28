interface SpecRow {
  label: string;
  value: string;
}

interface SpecsTableProps {
  size: string;
  category?: string | null;
  treadPattern?: string | null;
  loadIndex?: string | null;
  speedRating?: string | null;
}

/** FR-B4: specs table on the product detail page. Rows the product has no value for are left out. */
export function SpecsTable({ size, category, treadPattern, loadIndex, speedRating }: SpecsTableProps) {
  const rows: SpecRow[] = [
    { label: "Size", value: size },
    ...(category ? [{ label: "Category", value: category }] : []),
    ...(treadPattern?.trim() ? [{ label: "Tread pattern", value: treadPattern.trim() }] : []),
    ...(loadIndex ? [{ label: "Load index", value: loadIndex }] : []),
    ...(speedRating ? [{ label: "Speed rating", value: speedRating }] : []),
  ];

  return (
    <table className="w-full text-body">
      <caption className="sr-only">Specifications</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-border last:border-0">
            <th scope="row" className="py-2 pr-4 text-left font-medium text-muted">
              {row.label}
            </th>
            <td className="tabular py-2 text-text">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
