import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useBooks } from '../hooks/useBooks.js';
import { canManageBooks } from '../utils/roles.js';
import BookForm from '../components/books/BookForm.jsx';
import Spinner from '../components/common/Spinner.jsx';

export default function AdminPage() {
    const { user } = useAuth();
    const { books, loading, error, page, pagination, setPage, deleteBook, saveBook } = useBooks({ title: '', author: '', category: '', available: false });
    const [editingBook, setEditingBook] = useState(null);
    const [formError, setFormError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const canManage = useMemo(() => canManageBooks(user?.roles || []), [user?.roles]);

    const handleDelete = async (book) => {
        const confirmed = window.confirm(`¿Eliminar el libro "${book.title}"?`);
        if (!confirmed) return;
        await deleteBook(book.id);
    };

    const handleOpenForm = (book = null) => {
        setEditingBook(book);
        setFormError(null);
        setShowForm(true);
    };

    const handleSave = async (payload, id) => {
        setFormError(null);
        setSaving(true);
        try {
            await saveBook(payload, id);
            setShowForm(false);
        } catch (saveError) {
            setFormError(saveError.response?.data?.message || saveError.message || 'Error al guardar libro');
        } finally {
            setSaving(false);
        }
    };

    if (!canManage) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-900 shadow-sm">
                <h1 className="text-2xl font-semibold">Acceso denegado</h1>
                <p className="mt-3">Solo Admin o Bibliotecario pueden acceder al panel de administración.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-university-900">Panel administrativo</h1>
                    <p className="mt-2 text-slate-600">Gestiona los libros disponibles en la biblioteca universitaria.</p>
                </div>
                <button
                    type="button"
                    onClick={() => handleOpenForm()}
                    className="rounded-full bg-university-600 px-5 py-3 text-sm font-semibold text-white hover:bg-university-700"
                >
                    Nuevo libro
                </button>
            </div>

            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">{error}</div>}
            {loading && <Spinner />}

            {!loading && !error && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Título</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Autor</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">ISBN</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Copias totales</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Disponibles</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-800">{book.title}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.author}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.isbn || 'N/A'}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.totalCopies ?? 0}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.availableCopies ?? 0}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleOpenForm(book)}
                                                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book)}
                                                className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                        <span>Mostrando página {page} de {Math.max(1, Math.ceil(pagination.total / pagination.limit))}</span>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage(page + 1)}
                                disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <BookForm
                    book={editingBook}
                    onClose={() => setShowForm(false)}
                    onSave={handleSave}
                    loading={saving}
                />
            )}

            {formError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">{formError}</div>}
        </div>
    );
}
