import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { $user, setUser } from "store/user";
import { useStore } from "@nanostores/react";
import secureLocalStorage from "react-secure-storage";
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./styles.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const user = useStore($user);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token).data;
      secureLocalStorage.setItem("session", decodedToken); // Store user in secure storage
      setUser(decodedToken); // Store user in store
      navigate("/dashboard");
    }
  }, [token]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors on typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isLogin) {
        axios
          .post(`${BACKEND_URL}/api/user/auth/login`, {
            email: formData.email,
            password: formData.password,
          })
          .then((response) => {
            console.log("Inicio de sesión exitoso", response.data.data);

            secureLocalStorage.setItem("session", response.data.data); // Store user in secure storage

            setUser(response.data.data); // Store user in store
            setSubmitted(true);
            setFormData({
              name: "",
              email: "",
              password: "",
            });
            // redirect to dashboard
            navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Error al iniciar sesión", error);
            setErrors({ email: "Credenciales inválidas" });
          });
      } else {
        axios
          .post(`${BACKEND_URL}/api/user/auth/signup`, {
            name: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
          })
          .then((response) => {
            console.log("Registro exitoso", response.data);
            setSubmitted(true);
            setFormData({
              name: "",
              lastName: "",
              email: "",
              password: "",
              passwordConfirm: "",
            });

            navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Error al registrarse", error);
            setErrors({ email: "Error en el registro" });
          });
      }
    }
  };

  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleGoogleSignIn = () => {
    // Redirect to Google sign-in route
    window.location.href = `${BACKEND_URL}/auth/google/signin`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Ingresa tus credenciales para acceder"
              : "Completa el formulario para registrarte"}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de nombre (solo en registro) */}
          {!isLogin && (
            <div className="mt-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full py-2 px-4 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tu nombre completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}
          {!isLogin && (
            <>
              <div className="mt-6">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Apellido
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`pl-10 w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Apellido"
                  />
                </div>
              </div>
            </>
          )}

          {/* Campo de email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-4 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="ejemplo@correo.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className="mt-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-4 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={isLogin ? "Tu contraseña" : "Crea una contraseña"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <span>I</span> : <span>O</span>}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          {/* Campo de confirmación de contraseña (solo en registro) */}
          {!isLogin && (
            <>
              <div className="mt-6">
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPassword ? "text" : "password"}
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={`pl-10 w-full py-2 px-4 border ${
                      errors.passwordConfirm
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirma tu contraseña"
                  />
                </div>
                {errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Botón de envío */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={submitted}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                submitted
                  ? "bg-green-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {submitted ? (
                "Enviado con éxito"
              ) : (
                <>
                  <span>{isLogin ? "Iniciar Sesión" : "Registrarse"}</span>
                </>
              )}
            </button>
            <button type="button" style={{marginTop: "10px"}} onClick={handleGoogleSignIn}>
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              {isLogin ? "Iniciar sesión con Google" : "Registrarse con Google"}
            </button>
          </div>
        </form>

        {/* Alternar entre inicio de sesión y registro */}
        <div className=" text-center">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
