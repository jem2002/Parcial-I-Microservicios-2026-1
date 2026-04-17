import { useEffect, useState } from 'react';
import Spinner from '../common/Spinner.jsx';

const initialForm = {
    title: '',
    author: '',
    isbn: '',
    editorial: '',
    year: '',
    categories: '',
    totalCopies: '',
    availableCopies: '',
    description: '',
};

export default function BookForm({ book, onClose, onSave, loading }) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (book) {
            setForm({
                title: book.title || '',
                author: book.author || '',
                isbn: book.isbn || '',
                editorial: book.editorial || '',
                year: book.year || '',
                categories: (book.categories || []).join(', '),
                totalCopies: book.totalCopies ?? '',
                availableCopies: book.availableCopies ?? '',
                description: book.description || '',
            });
        } else {
            setForm(initialForm);
        }
    }, [book]);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.title.trim()) nextErrors.title = 'Título es obligatorio';
        if (!form.author.trim()) nextErrors.author = 'Autor es obligatorio';
        if (!form.totalCopies || Number(form.totalCopies) < 1) nextErrors.totalCopies = 'Copias totales debe ser mayor a 0';
        if (form.availableCopies === '' || Number(form.availableCopies) < 0) nextErrors.availableCopies = 'Copias disponibles debe ser 0 o más';
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        const payload = {
            title: form.title.trim(),
            author: form.author.trim(),
            isbn: form.isbn.trim() || undefined,
            editorial: form.editorial.trim() || undefined,
            year: form.year ? Number(form.year) : undefined,
            categories: form.categories.split(',').map((tag) => tag.trim()).filter(Boolean),
            totalCopies: Number(form.totalCopies),
            availableCopies: Number(form.availableCopies),
            description: form.description.trim() || undefined,
        };

        await onSave(payload, book?.id);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-university-900">
                            {book ? 'Editar libro' : 'Nuevo libro'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Completa los campos para {book ? 'actualizar' : 'crear'} el libro.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-900">
                        Cerrar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {[
                        { label: 'Título', field: 'title' },
                        { label: 'Autor', field: 'author' },
                        { label: 'ISBN', field: 'isbn' },
                        { label: 'Editorial', field: 'editorial' },
                        { label: 'Año', field: 'year', type: 'number' },
                        { label: 'Categorías', field: 'categories' },
                        { label: 'Copias totales', field: 'totalCopies', type: 'number' },
                        { label: 'Copias disponibles', field: 'availableCopies', type: 'number' },
                    ].map(({ label, field, type }) => (
                        <label key={field} className="block text-sm text-slate-700">
                            {label}
                            <input
                                type={type || 'text'}
                                value={form[field]}
                                onChange={handleChange(field)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors[field] && <p className="mt-2 text-xs text-rose-600">{errors[field]}</p>}
                        </label>
                    ))}

                    <label className="block text-sm text-slate-700">
                        Descripción
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            rows="4"
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-university-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <Spinner /> : book ? 'Guardar cambios' : 'Crear libro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
