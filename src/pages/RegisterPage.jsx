import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register } from '../api/auth.api.js';
import Spinner from '../components/common/Spinner.jsx';

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(location.state?.successMessage || '');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
        setServerError('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.username.trim()) nextErrors.username = 'Usuario es obligatorio';
        if (!form.email.trim()) nextErrors.email = 'Email es obligatorio';
        if (!form.password.trim()) nextErrors.password = 'Contraseña es obligatoria';
        if (form.password && form.password.length < 6) nextErrors.password = 'Debe tener al menos 6 caracteres';
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setServerError('');
        try {
            await register(form);
            navigate('/login', { state: { successMessage: 'Registro exitoso, ahora inicia sesión.' } });
        } catch (error) {
            setServerError(error.response?.data?.message || error.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
                <h1 className="text-3xl font-semibold text-university-900">Crear cuenta</h1>
                <p className="mt-2 text-sm text-slate-600">Completa el formulario para crear tu usuario universitario.</p>

                {success && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
                {serverError && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</div>}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {[
                        { label: 'Usuario', field: 'username', type: 'text' },
                        { label: 'Email', field: 'email', type: 'email' },
                        { label: 'Contraseña', field: 'password', type: 'password' },
                    ].map(({ label, field, type }) => (
                        <label key={field} className="block text-sm text-slate-700">
                            {label}
                            <input
                                type={type}
                                value={form[field]}
                                onChange={handleChange(field)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors[field] && <p className="mt-2 text-xs text-rose-600">{errors[field]}</p>}
                        </label>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-full bg-university-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? <Spinner /> : 'Registrar cuenta'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-semibold text-university-700 hover:text-university-900">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
