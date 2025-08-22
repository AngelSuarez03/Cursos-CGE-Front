import '../Principal/Principal.css';
import rlceImage from '../Imagenes/rlce.webp';
import ivaiImage from '../Imagenes/ivai.webp'
import FacebookIcon from '../assets/facebook.svg';
import YoutubeIcon from '../assets/youtube.svg';
import TwitterIcon from '../assets/twitter-x.svg';
import InstagramIcon from '../assets/instagram.svg';
import MailIcon from '../assets/email.svg';
import WebIcon from '../assets/web.svg';
import CardInfo from '../Componentes/CardInfo';
import Ubi from '../assets/ubi.svg'
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { API_URL } from '../util/Constantes.js';

function Principal() {

    const [dataCursos, setDataCurso] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const cursosPerPage = 10;
    const indexOfLastRegistro = currentPage * cursosPerPage;
    const indexOfFirstRegistro = indexOfLastRegistro - cursosPerPage;
    const activeCursos = dataCursos.filter(curso => curso.estatusCurso === 'Activo');
    const totalPages = Math.ceil(activeCursos.length / cursosPerPage);
    const currentCursos = activeCursos.slice(indexOfFirstRegistro, indexOfLastRegistro);

    const getCursos = async () => {
        try {
            const response = await fetch(`${API_URL}obtenerCursos`);
            const data = await response.json();
            setDataCurso(data);
        } catch (error) {
            console.error('Error al obtener los registros de curso:', error);
        }
    };

    const handleLocal = (idCurso) => {
        window.localStorage.setItem('id', idCurso);
    }

    useEffect(() => {
        getCursos();
    }, []);


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
            <section class="layout">
                <div class="header">
                    <h1 className="header-title">
                        Cursos disponibles
                    </h1>
                    <img src={ivaiImage} alt="" className="header-img-left" />
                </div>
                <div className='Main'>
                    <div className='InfoCursos'>
                        {currentCursos.length > 0 ? (
                            currentCursos.map((curso) => (
                                curso.estatusCurso === 'Activo' ? (
                                    <div key={curso.idCurso} onClick={() => handleLocal(curso.idCurso)}>
                                        {curso.estatusCupo == 0 ? (
                                            <CardInfo
                                            NombreCurso={curso.nombreCurso}
                                            FechaCurso={curso.fecha}
                                            ModalidadCurso={curso.modalidad}
                                            ExpositorCurso={curso.imparte}
                                            HoraCurso={curso.hora}
                                            CupoDisponible={curso.estatusCupo}
                                            Cupo={curso.cupo}
                                            reloadCursos={getCursos}
                                            Boton={0}
                                        />
                                        ) : (
                                            <CardInfo
                                                NombreCurso={curso.nombreCurso}
                                                FechaCurso={curso.fecha}
                                                ModalidadCurso={curso.modalidad}
                                                ExpositorCurso={curso.imparte}
                                                HoraCurso={curso.hora}
                                                CupoDisponible={curso.estatusCupo}
                                                Cupo={curso.cupo}
                                                reloadCursos={getCursos}
                                                Boton={1}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    null
                                )
                            ))
                        ) : (
                            <div className='NoCursos'>
                                <p>No hay cursos registrados</p>
                            </div>
                        )}
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


                    <div className="privacy-notice">
                        <h2 className="privacy-title">
                            AVISO DE PRIVACIDAD SIMPLIFICADO DE CAPACITACIONES O EVENTOS PRESENCIALES.
                        </h2>
                        <p className="privacy-text">
                            El Instituto Veracruzano de Acceso a la Información y Protección de Datos Personales es el responsable del tratamiento
                            de los datos personales que nos proporcione.Sus datos personales serán utilizados para las siguientes finalidades:
                            a) registrar su inscripción a la modalidad de capacitación que haya elegido;
                            b) generar listas de asistencia y validación de las mismas;
                            c) emitir constancia de participación o asistencia de acuerdo a la modalidad de que se trate;
                            d) establecer comunicación para dar seguimiento de los cursos o aclaración de dudas sobre sus datos, ya sea por algún error o imprecisión,
                            notificación de cancelación o cambio de horario, fecha o sede; e) generar estadísticas para informes
                            obligatorios del Instituto ante otros organismos públicos o privados y
                            f) en el caso de las fotografías que se tomen durante el evento, serán utilizadas para difundir las actividades a través de los diferentes
                            espacios de comunicación y/o información con los que cuenta el Instituto.De manera adicional,
                            utilizaremos su información personal para las siguientes finalidades que no son necesarias, pero que nos permiten y
                            facilitan brindarle una mejor atención: a) envío de material de exposición o apoyo e b) invitaciones a futuros eventos.
                            En caso de que no desee que sus datos personales sean tratados para las finalidades adicionales, usted puede manifestarlo en el
                            correo electrónico direcciondecapacitacion.ivai@outlook.com.Se informa que no se realizarán transferencias que requieran su consentimiento,
                            salvo aquellas que sean necesarias para atender requerimientos de información de una autoridad competente, debidamente fundados y motivados.
                            Usted podrá consultar el aviso de privacidad integral en el sitio de internet: <a href='http://www.ivai.org.mx/?p=15910'>http://www.ivai.org.mx/?p=15910</a>, en la sección de avisos de privacidad.
                        </p>
                        <div className="address-container">
                            <p className="dir">
                                Calle Guadalupe Victoria #7, Zona Centro, C.P. 91000, Xalapa, Veracruz.
                            </p>
                            <a href="https://maps.app.goo.gl/q4NLaByuVnYCrV9RA" target="_blank" rel="noopener noreferrer">
                                <img className="imgUb" src={Ubi} alt="Ubicación" />
                            </a>
                        </div>

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

        </>
    );
}

export default Principal;
