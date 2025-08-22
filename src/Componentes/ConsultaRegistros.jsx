import ivaiImage from '../Imagenes/ivai.webp';
import '../Estilos/ConsultaRegistros.css';
import FacebookIcon from '../assets/facebook.svg';
import YoutubeIcon from '../assets/youtube.svg';
import TwitterIcon from '../assets/twitter-x.svg';
import InstagramIcon from '../assets/instagram.svg';
import MailIcon from '../assets/email.svg';
import WebIcon from '../assets/web.svg';
import Ubi from '../assets/ubi.svg';
import Arrow from '../assets/arrow.svg';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import PopupRegistro from './PopupRegistro';
import { useNavigate } from 'react-router-dom';
import ConfirmIcon from '../assets/check.svg';
import PopupMSJBien from './PopupMSJBien.jsx'
import ErrorIcon from '../assets/error.svg';
import CargandoIvai from '../Imagenes/Ivaisito2.0.png'
import { API_URL } from '../util/Constantes.js';
import { alignProperty } from '@mui/material/styles/cssUtils.js';

function ConsultaRegistros(Props) {

    var cupoRestante = window.localStorage.getItem('CupoRestante')
    var cupoTotal = window.localStorage.getItem('CupoTotal')

    const [dataRegistros, setDataRegistros] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenMsj, setIsPopupOpenMsj] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataError, setDataError] = useState({
   titulo: '',
   mensaje: '',
});

    const [dataCupoRestante, setDataCupoRestante] = useState(cupoRestante)

    const [curso, setCurso] = useState ({
        nombreCurso: '',
        fecha: '',
        hora: '',
        imparte: '',
        Cupo: 0,
        estatusCupo: 0,
        estatusCurso: '',
        modalidad: '',
        direccion: '',
        correoSeguimiento: 'cursos.ivai@gmail.com',
        tipo: '',
        curso: '',
        ligaTeams: '',
        valorCurricular: '',
    })

    const id = window.localStorage.getItem('id');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const registrosPerPage = 6;

    const getRegistros = async (idCurso) => {
        try {
            const response = await fetch(`${API_URL}obtenerRegistros/${idCurso}`);
            const data = await response.json();
            setDataRegistros(data);
        } catch (error) {
            console.error('Error al obtener los registros de curso:', error);
        }
    };

    const getCurso = async (idCurso) => {
        try {
            const response = await fetch(`${API_URL}obtenerCurso/${idCurso}`);
            const data = await response.json();
            setCurso(data);
        } catch (error) {
            console.error('Error al obtener el curso');
        }
    };

    useEffect(() => {
        getRegistros(id);
    }, []);

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
            }, 300);
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
            }, 300);
        }
    };


    const obtenerRegistros = async (idCurso) => {
        try {
            const response = await fetch(`${API_URL}obtenerExcelRegistros/${idCurso}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `registros_curso_${idCurso}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
        }
    };

    const eliminarRegistro = async (idRegistro, idCurso) => {
        try {
            const response = await fetch(`${API_URL}eliminarRegistro`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idRegistro, idCurso }),
            });

            if (response.ok) {
                getRegistros(idCurso);
            } else {
                console.error('Error al eliminar el registro');
            }
        } catch (error) {
            console.error('Error al eliminar el registro del curso:', error);
        }
    };

           

    const mandarConstancias = async (idCurso) => { 
        try {
            const response = await fetch(`${API_URL}obtenerPdf/${idCurso}`);
    
            if (!response.ok) {
                throw new Error("No se pudo descargar el archivo");
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
    
            a.href = url;
            a.download = "constancias.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        }
    };

    const mandarConstanciasAsistenteCorreo = async (idCurso, idRegistro) => {
        try {
          const response = await fetch(`${API_URL}mandarConstanciaAsistente`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idCurso, idRegistro }),
          });
          
          if (!response.ok) {
            throw new Error("Error al enviar los correos");
          }
          
          const mensaje = await response.text();
          alert(mensaje);
        } catch (error) {
          console.error("Error al enviar los correos:", error);
        }
      };

    const mandarConstanciasCorreo = async (idCurso) => {
        try {
          const response = await fetch(`${API_URL}enviarConstancias/${idCurso}`);
          if (!response.ok) {
            throw new Error("Error al enviar los correos");
          }
          const mensaje = await response.text();
          alert(mensaje);
        } catch (error) {
          console.error("Error al enviar los correos:", error);
        }
      };
      
    

    const handleNavigation = () => {
        navigate('/RegistroCurso');
    }

    const handleRegistroExitoso = () => {
        getRegistros(id);
    };

    const indexOfLastRegistro = currentPage * registrosPerPage;
    const indexOfFirstRegistro = indexOfLastRegistro - registrosPerPage;
    const currentRegistros = dataRegistros.slice(indexOfFirstRegistro, indexOfLastRegistro);

    const totalPages = Math.ceil(dataRegistros.length / registrosPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <section className="layout">
                <div className="header">
                <div className='back-icon'>
                        <img src={Arrow} alt='Flecha Regresar' className='icon' onClick={handleNavigation} />
                        <label className='icon-text'>Regresar</label>
                    </div>
                    <h1 className="header-title">
                    </h1>
                    
                    
                </div>
                <div className='Main-Admin'>

                    <div style={{ textAlign:'end', marginRight:'12%', fontSize:'22px' }}>Cupos: {dataCupoRestante} / {cupoTotal}</div>
                    
                    <div className='table-Container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Sujeto Obligado</th>
                                    <th>Teléfono</th>
                                    <th>Correo Electrónico</th>
                                    <th>Intérprete</th>
                                    <th>Asistencia</th>
                                    <th>Acción</th>
                                    <th>Constancia</th>
                                </tr>
                            </thead>
                            <tbody className='table-Data'>
                                {currentRegistros.length > 0 ? (
                                    currentRegistros.map((registro, index) => (
                                        <tr key={index}>
                                            <td>{registro.nombre}</td>
                                            <td>{registro.apellidos}</td>
                                            <td>{registro.so}</td>
                                            <td>{registro.telefono}</td>
                                            <td>{registro.correo}</td>
                                            {registro.interprete === 'true' ? (
                                                <td>Sí</td>
                                            ) : (
                                                <td>No</td>
                                            )}
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={registro.asistencia === 'true'}
                                                    onChange={async (e) => {
                                                        const asistenciaActualizada = e.target.checked ? 'true' : 'false';
                                                    
                                                        // Buscar el índice correcto en dataRegistros
                                                        const updatedData = [...dataRegistros];
                                                        const registroIndex = updatedData.findIndex((r) => r.idRegistro === registro.idRegistro);
                                                        
                                                        if (registroIndex !== -1) {
                                                            updatedData[registroIndex].asistencia = asistenciaActualizada;
                                                            setDataRegistros(updatedData);
                                                        }
                                                    
                                                        try {
                                                            const response = await fetch(`${API_URL}actualizarRegistro`, {
                                                                method: 'PUT',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({
                                                                    idRegistro: registro.idRegistro,
                                                                    asistencia: asistenciaActualizada,
                                                                }),
                                                            });
                                                    
                                                            const data = await response.json();
                                                            console.log('Respuesta del servidor:', data.mensaje);
                                                    
                                                        } catch (error) {
                                                            console.error('Error al actualizar la asistencia:', error);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td><label className='delete-register' onClick={() => eliminarRegistro(registro.idRegistro, registro.idCurso)}><u>Eliminar</u></label></td>
                                            <td><label className='delete-register' onClick={() => mandarConstanciasAsistenteCorreo(id,registro.idRegistro)}><u>Enviar</u></label></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    <div className="pagination">
                        <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>

                        <div className="pagination-numbers-container">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                    key={index + 1}
                                    onClick={() => goToPage(index + 1)}
                                    disabled={currentPage === index + 1}
                                    className="pagination-number"
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>

                        <Button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
                        
                    </div>

                    <div className='button-Container'>
                        <Button onClick={() => obtenerRegistros(id)} variant="contained" sx={{ backgroundColor: '#E7B756', color: "#1E1E1E", fontSize: '2vh', margin: '2vw' }}>Descargar Registros</Button>
                        <Button onClick={handleOpenPopup} variant="contained" sx={{ backgroundColor: '#E7B756', color: "#1E1E1E", fontSize: '2vh', margin: '2vw' }}>Agregar Registro</Button>
                        <Button onClick={() => mandarConstancias(id)} variant='contained' sx={{ backgroundColor: '#E7B756', color: "#1E1E1E", fontSize: '2vh', margin: '2vw' }}>Descargar Constancias</Button>
                        <Button onClick={() => mandarConstanciasCorreo(id)} variant='contained' sx={{ backgroundColor: '#E7B756', color: "#1E1E1E", fontSize: '2vh', margin: '2vw' }}>Envíar Constancias</Button>
                    </div>
                    <div className="address-container">
                        <p className="dir">
                            Calle Guadalupeee Victoria #7, Zona Centro, C.P. 91000, Xalapa, Veracruz.
                        </p>
                        <a href="https://maps.app.goo.gl/q4NLaByuVnYCrV9RA" target="_blank" rel="noopener noreferrer">
                            <img className="imgUb" src={Ubi} alt="Ubicación" />
                        </a>
                    </div>
                </div>


                <div className="footer">

                    <div className="social-group">
                        <a href="https://www.facebook.com/ivaiveracruz" target="_blank" rel="noopener noreferrer">
                            <img src={FacebookIcon} alt="Facebook" />
                        </a>
                        <a href="https://www.youtube.com/@IVAIVeracruz" target="_blank" rel="noopener noreferrer">
                            <img src={YoutubeIcon} alt="YouTube" />
                        </a>
                        <p>ivaiveracruz</p>
                    </div>


                    <div className="social-group">
                        <a href="https://x.com/VERIVAI" target="_blank" rel="noopener noreferrer">
                            <img src={TwitterIcon} alt="Twitter" />
                        </a>
                        <a href="https://www.instagram.com/verivai" target="_blank" rel="noopener noreferrer">
                            <img src={InstagramIcon} alt="Instagram" />
                        </a>
                        <p>verivai</p>
                    </div>


                    <div className="social-group">
                        <a href="mailto:contacto@verivai.org.mx">
                            <img src={MailIcon} alt="Correo" />
                        </a>
                        <p>contacto@verivai.org.mx</p>
                    </div>


                    <div className="social-group">
                        <a href="https://ivai.org.mx" target="_blank" rel="noopener noreferrer">
                            <img src={WebIcon} alt="Web" />
                        </a>
                        <p>ivai.org.mx</p>
                    </div>
                </div>

            </section>
            
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className={`popup-content ${isPopupOpen ? 'popup-show' : 'popup-hide'}`}>
                        <div className="popup-responsive">
                            <PopupRegistro 
                                onClose={handleClosePopup}
                                onOpenPopupMsj={(errorData, errorStatus) => handleOpenPopupMsj(errorData, errorStatus)}
                                cupo={Props.CupoDisponible}
                                onReload={getRegistros(id)}
                                setIsLoading={setIsLoading} 
                                cuposRestantes={dataCupoRestante}
                                setCuposRestantes={setDataCupoRestante}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {isLoading && ( 
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
                            realoadCursos={handleRegistroExitoso}
                        />
                    </div>
                </div>
            )}

        </>
    )
}

export default ConsultaRegistros;
