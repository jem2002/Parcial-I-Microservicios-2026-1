import { canManageBooks } from '../../utils/roles.js';

export default function BookCard({ book, onEdit, onDelete, currentRoles }) {
    const available = book.availableCopies > 0;
    const showActions = canManageBooks(currentRoles);

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-university-900">{book.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{book.author} • {book.editorial || 'Editorial desconocida'}</p>
                    <p className="mt-2 text-sm text-slate-600">Año: {book.year || 'N/A'}</p>
                </div>
                <div className="space-y-2 text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {available ? 'Disponible' : 'Agotado'} · {book.availableCopies ?? 0}
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                        {book.categories?.map((category) => (
                            <span key={category} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {book.description && <p className="mt-4 text-sm leading-6 text-slate-700">{book.description}</p>}

            {showActions && (
                <div className="mt-5 flex flex-wrap gap-3">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(book)}
                            className="rounded-full bg-university-600 px-4 py-2 text-sm font-semibold text-white hover:bg-university-700"
                        >
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(book)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
