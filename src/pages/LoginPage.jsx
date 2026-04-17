import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setCredentials({ ...credentials, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
        setServerError('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!credentials.usernameOrEmail.trim()) nextErrors.usernameOrEmail = 'Usuario o correo es obligatorio';
        if (!credentials.password.trim()) nextErrors.password = 'Contraseña es obligatoria';
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
            await login(credentials);
            navigate('/catalog');
        } catch (error) {
            setServerError(error.response?.data?.message || error.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
                <h1 className="text-3xl font-semibold text-university-900">Iniciar sesión</h1>
                <p className="mt-2 text-sm text-slate-600">Ingresa tus datos para acceder al catálogo de la biblioteca.</p>

                {serverError && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</div>}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block text-sm text-slate-700">
                        Usuario o correo
                        <input
                            value={credentials.usernameOrEmail}
                            onChange={handleChange('usernameOrEmail')}
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                        />
                        {errors.usernameOrEmail && <p className="mt-2 text-xs text-rose-600">{errors.usernameOrEmail}</p>}
                    </label>

                    <label className="block text-sm text-slate-700">
                        Contraseña
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={handleChange('password')}
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                        />
                        {errors.password && <p className="mt-2 text-xs text-rose-600">{errors.password}</p>}
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-full bg-university-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? <Spinner /> : 'Ingresar'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="font-semibold text-university-700 hover:text-university-900">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
