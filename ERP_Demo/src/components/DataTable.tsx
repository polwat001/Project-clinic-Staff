interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="erp-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="erp-table-header">
              {columns.map(col => (
                <th key={col.key} className={`px-4 py-3 text-left ${col.className || ""}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map(item => (
              <tr key={keyExtractor(item)} className="hover:bg-muted/30 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
