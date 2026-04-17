import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/books/BookCard.jsx';
import BookFilters from '../components/books/BookFilters.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useBooks } from '../hooks/useBooks.js';
import { canManageBooks } from '../utils/roles.js';

export default function CatalogPage() {
    const { user } = useAuth();
    const { books, filters, loading, error, page, pagination, updateFilters, setPage } = useBooks({ title: '', author: '', category: '', available: false });
    const canManage = useMemo(() => canManageBooks(user?.roles || []), [user?.roles]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-university-900">Catálogo de libros</h1>
                <p className="mt-2 text-slate-600">Busca y filtra el inventario disponible en la biblioteca universitaria.</p>
            </div>

            <BookFilters filters={filters} onChange={updateFilters} />

            {loading && <Spinner />}
            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">{error}</div>}

            {!loading && !error && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {books.length ? books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            currentRoles={user?.roles || []}
                            onEdit={canManage ? () => { } : undefined}
                            onDelete={canManage ? () => { } : undefined}
                        />
                    )) : (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">No se encontraron libros con esos filtros.</div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm text-slate-600">Página {pagination.page} de {Math.max(1, Math.ceil(pagination.total / pagination.limit))}</span>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page <= 1}
                        className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                        className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {canManage && (
                <div className="rounded-3xl border border-university-100 bg-university-50 p-6 text-slate-700 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-university-900">Modo administrador</p>
                            <p className="mt-2 text-sm">Como Admin o Bibliotecario, también puedes administrar libros desde el panel.</p>
                        </div>
                        <Link
                            to="/admin"
                            className="inline-flex rounded-full bg-university-600 px-5 py-3 text-sm font-semibold text-white hover:bg-university-700"
                        >
                            Ir al panel admin
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
