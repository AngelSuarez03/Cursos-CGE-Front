import './Login.css';
import ivaiFachada from '../Imagenes/IVAI_Fachada.jpg';
import ivaiImage from '../Imagenes/ivai.webp';
import rlceImage from '../Imagenes/rlce.webp';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import PopupMSJBien from "../Componentes/PopupMSJBien.jsx";
import ConfirmIcon from '../assets/check.svg';
import ErrorIcon from '../assets/error.svg';
import { useAuth } from '../routes/AuthContext.jsx'; 
import { API_URL } from '../util/Constantes.js';

function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [errores, setErrores] = useState({});
    const [isError, setIsError] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [datosFormulario, setDatosFormulario] = useState({
        usuario: '',
        password: ''
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [popupConfig, setPopupConfig] = useState({
        icon: isError ? ErrorIcon : ConfirmIcon,
        title: "¡Bienvenido!",
        message: "Al dar clic en el botón de aceptar será redirigido a la siguiente pantalla.",
        buttonText: "Aceptar",
        onAction: () => navigate('/RegistroCurso')
    });

    const handleOpenPopup = (config) => {
        setPopupConfig(config);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        const popup = document.querySelector('.popup-content-msj');
        if (popup) {
            popup.classList.remove('popup-show');
            popup.classList.add('popup-hide');
            setTimeout(() => {
                setIsPopupOpen(false);
            }, 300);
        }
    };

    const peticionLogin = async () => {
        try {
            const respuesta = await axios.post(`${API_URL}validacion`, datosFormulario);
            return respuesta;
        } catch (error) {
            throw error;
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!datosFormulario.usuario) {
            nuevosErrores.usuario = 'El campo usuario es obligatorio.';
        }

        if (!datosFormulario.password) {
            nuevosErrores.password = 'El campo contraseña es obligatorio';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const procesarFormulario = async (evento) => {
        evento.preventDefault();
        setCargando(true);

        if (!validarFormulario()) {
            setCargando(false);
            return;
        }

        try {
            const respuesta = await peticionLogin();

            if (respuesta.data.mensaje === 'Usuario correcto') {
                login(respuesta.data.token);
                handleOpenPopup({
                    icon: ConfirmIcon,
                    title: "¡Bienvenido!",
                    message: "Al dar clic en el botón de aceptar será redirigido a la siguiente pantalla.",
                    buttonText: "Aceptar",
                    onAction: () => navigate('/RegistroCurso')
                });
            } else {
                handleOpenPopup({
                    icon: ErrorIcon,
                    title: "¡Credenciales incorrectas!",
                    message: "Las credenciales ingresadas no son válidas. Inténtalo de nuevo.",
                    buttonText: "Reintentar",
                    onAction: handleClosePopup
                });
                setDatosFormulario({
                    usuario: '',
                    password: ''
                });
                setErrores({});
            }
        } catch (error) {
            console.error("Error en el login: ", error);
            handleOpenPopup({
                icon: ErrorIcon,
                title: "¡Error!",
                message: "Ocurrió un error durante el proceso. Por favor, inténtelo de nuevo más tarde.",
                buttonText: "Aceptarr",
                onAction: handleClosePopup
            });
        } finally {
            setCargando(false);
        }
    };

    const cambiosFormulario = (evento) => {
        const { name, value } = evento.target;

        setErrores((prevErrores) => ({
            ...prevErrores,
            [name]: ''
        }));

        setDatosFormulario({
            ...datosFormulario,
            [name]: value
        });
    };

    return (<>
        <section className="layout_l">
            <div className="contenedorLogin">
                <div className="left">
                    <div id="ContenedorFachada">
                        <img className='fachada' src={ivaiFachada} />
                        <img className="logo_ivai" src={ivaiImage} />
                    </div>
                </div>
                <div className="right">
                    <img src={rlceImage} className='img-right-l'></img>

                    <form action="" className='form-login' onSubmit={procesarFormulario}>
                        <p>Usuario</p>
                        <input type="text" onChange={cambiosFormulario} name="usuario" value={datosFormulario.usuario} />
                        {errores.usuario && <span className="error-message">{errores.usuario}</span>}
                        <p>Contraseña</p>
                        <input type="password" onChange={cambiosFormulario} name="password" value={datosFormulario.password} />
                        {errores.password && <span className="error-message">{errores.password}</span>}
                        <input type="submit" className="btn_ingresar" disabled={cargando} value="INGRESAR" />
                    </form>
                </div>
            </div>

            <div className="footer_l">
                {/* Social links */}
            </div>
        </section>

        {isPopupOpen && (
            <div className="popup-overlay">
                <div className={`popup-content-msj ${isPopupOpen ? 'popup-show' : 'popup-hide'}`}>
                    <PopupMSJBien
                        icon={popupConfig.icon}
                        title={popupConfig.title}
                        message={popupConfig.message}
                        buttonText={popupConfig.buttonText}
                        onClose={handleClosePopup}
                        onAction={popupConfig.onAction}
                    />
                </div>
            </div>
        )}
    </>);
}

export default Login;
