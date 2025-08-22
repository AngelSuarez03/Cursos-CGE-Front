import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useState } from "react";
import PopupRegistro from '../Componentes/PopupRegistro';
import '../Estilos/CardInfo.css';
import PopupMSJBien from './PopupMSJBien.jsx';
import ConfirmIcon from '../assets/check.svg';
import ErrorIcon from '../assets/error.svg';
import CargandoIvai from '../Imagenes/Ivaisito2.0.png'

function CardInfo(Props) {
    
    
    var cupoRestante = Props.CupoDisponible;
    var cupoTotal = Props.Cupo;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenMsj, setIsPopupOpenMsj] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Mueve isLoading a CardInfo
    const [dataError, setDataError] = useState({
        titulo: '',
        mensaje: '',
    });
    const [dataCupoRestante, setDataCupoRestante] = useState(cupoRestante)

    const [dataRegistros, setDataRegistros] = useState([]);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
        document.body.style.overflow = "hidden";
        setScrollEnabled(false);
    };

    const handleClosePopup = () => {
        const popup = document.querySelector('.popup-content');
        if (popup) {
            popup.classList.remove('popup-show');
            popup.classList.add('popup-hide');
            setTimeout(() => {
                setIsPopupOpen(false);
                Props.reloadCursos();
                document.body.style.overflow = "auto";
                setScrollEnabled(true);
            }, 300); // Duración de la animación de salida
        }
    };

    const handleOpenPopupMsj = (errorData, errorStatus) => {
        setDataError(errorData);
        setIsError(errorStatus);
        setIsPopupOpenMsj(true);
        document.body.style.overflow = "hidden";
        setScrollEnabled(false);
    };

    const handleClosePopupMsj = () => {
        const popup = document.querySelector('.popup-content-msj');
        if (popup) {
            popup.classList.remove('popup-show');
            popup.classList.add('popup-hide');
            setTimeout(() => {
                setIsPopupOpenMsj(false);
                Props.reloadCursos();
                document.body.style.overflow = "auto";
                setScrollEnabled(true);
            }, 300); // Duración de la animación de salida
        }
    };

    function obtenerColorCupo(cupoDisponible, cupoTotal) {
        const porcentaje = (cupoDisponible / cupoTotal) * 100;
        if (cupoDisponible === 0) {
            return 'red';
        } else if (porcentaje <= 50) {
            return 'orange';
        } else {
            return '#35ce00';
        }
    }

    return (
        <>
            <div className="Card-Info-Cursos">
                <Card className='Card-Contenedor' variant="elevation" sx={{ maxWidth: '100%', maxHeight: '60%', backgroundColor: '#A35494', marginBottom: '2vw', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                    <CardContent className='Card-Contenido' sx={{ color: '#FFFFFF', marginLeft: 1, marginTop: 1 }}>
                        <div className="Card-Container">
                            <div className="Card-Content">
                                <label className="Card-Lugares" id="cupoDisponible">Cupos:<p id="numeroCupoDisponible" style={{ backgroundColor: obtenerColorCupo(Props.CupoDisponible, Props.Cupo) }}>{Props.CupoDisponible}</p></label>
                                <label className="Card-Titulo">{Props.NombreCurso}</label><br />
                                <div className="Info-Card">
                                    <label className="Card-text" variant="body2">Persona que imparte el curso: {Props.ExpositorCurso}</label>
                                    <label className="Card-text" variant="body2">Modalidad: {Props.ModalidadCurso}</label>
                                    <label className="Card-text" variant="body2">Fecha: {Props.FechaCurso}</label>
                                    <label className="Card-text" variant="body2">Hora: {Props.HoraCurso}</label>
                                </div>
                                <CardActions className="Card-Actions">
                                    {Props.Boton == 1 ? (
                                    <button className='Boton-Card' onClick={handleOpenPopup} variant="contained">
                                        Ver Disponibilidad
                                    </button>
                                    ) : (
                                        <button className='Boton-Card' disabled  variant="contained">
                                            Curso lleno
                                        </button>
                                    )}
                                </CardActions>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className={`popup-content ${isPopupOpen ? 'popup-show' : 'popup-hide'}`}>
                        <div className="popup-responsive">
                            <PopupRegistro
                                onClose={handleClosePopup}
                                onOpenPopupMsj={(errorData, errorStatus) => handleOpenPopupMsj(errorData, errorStatus)}
                                cupo={Props.CupoDisponible}
                                onReload={Props.reloadCursos}
                                setIsLoading={setIsLoading}
                                cuposRestantes={dataCupoRestante}
                                setCuposRestantes={setDataCupoRestante}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isLoading && ( // Muestra el spinner si isLoading es true
                <div className="popup-overlay">
                    <div className="spinner">
                        <img className="cargando" src={CargandoIvai} />
                    </div>
                </div>
            )}

            {isPopupOpenMsj && (
                <div className="popup-overlay">
                    <div className={`popup-content-msj ${isPopupOpenMsj ? 'popup-show' : 'popup-hide'}`}>
                        <PopupMSJBien
                            icon={isError ? ErrorIcon : ConfirmIcon}
                            title={dataError.titulo}
                            message={dataError.mensaje}
                            buttonText="Cerrar"
                            onClose={handleClosePopupMsj}
                            onClosePrev={handleClosePopup}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default CardInfo;




