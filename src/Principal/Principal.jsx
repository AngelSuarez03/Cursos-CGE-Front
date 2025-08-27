import '../Principal/Principal.css';
import rlceImage from '../Imagenes/rlce.webp';
import ivaiImage from '../Imagenes/ivai.webp'
import CGEImage from '../Imagenes/Logo_CGE.png'
import AmorImage from '../Imagenes/Logo_AMORVER.png'
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
                        Capacitaciones disponibles
                    </h1>
                    <img src={CGEImage} alt="" className="header-img-left" />
                    <img src={AmorImage} alt="" className="header-logo-right" />
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
                                            tipo={curso.tipo}
                                            detalles={curso.detalles}
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
                                                tipo={curso.tipo}
                                                detalles={curso.detalles}
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
                            Aviso de Privacidad Simplificado de los Cursos de Capacitación.
                        </h2>
                        <p className="privacy-text">
                            La Contraloría General del Estado, es la responsable del uso, tratamiento y destino de los datos personales que se reciben para el registro y control de asistencias a las capacitaciones impartidas por las áreas de la Contraloría General. <br/>
                            Los datos personales que recabamos de usted serán exclusivamente utilizados para cumplir con los objetivos y atribuciones de esta Dependencia, el tratamiento que se realice será únicamente para las siguientes finalidades: 
                            a) Registrar su inscripción al curso o capacitación elegida; 
                            b) Integración de las listas de control de asistencia; 
                            c) Para la elaboración y entrega de constancias, diplomas o reconocimientos de participación; 
                            d) Medio de contacto con los participantes para notificar cambios imprevistos de fecha, horario o sede de los cursos y 
                            e) Generación de estadísticas para informes y seguimiento de las actividades de la Dependencia. Asimismo, se comunica que no se efectuarán tratamientos adicionales. <br/>
                            Para conocer a detalle la información relacionada con el tratamiento de sus datos y los derechos que le asisten, 
                            puede consultar el Aviso de Privacidad Integral de los Cursos de Capacitación publicado en la página electrónica oficial de la Contraloría General <a href='http://www.veracruz.gob.mx/contraloria/avisos-de-privacidad/' >http://www.veracruz.gob.mx/contraloria/avisos-de-privacidad/</a> <br/>
                             O bien puede ponerse en contacto con la Unidad de Transparencia ubicada en Calle Ignacio de la Llave No. 105, Colonia Salud, Xalapa, Veracruz, C.P. 91055, teléfono: (228) 8 41 74 00, Ext. 3089, en horario 09:00 a 15:00 y de 16:00 a 18:00 hrs., Correo electrónico institucional: <a href='mailto:uaip@cgever.gob.mx'>uaip@cgever.gob.mx</a>

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
                        <a href="https://www.facebook.com/ContraloriaGeneralVeracruz" target="_blank" rel="noopener noreferrer">
                            <img src={FacebookIcon} alt="Facebook" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCLHiMj26O-EH9BMwyP_2kBw" target="_blank" rel="noopener noreferrer">
                            <img src={YoutubeIcon} alt="YouTube" />
                        </a>
                        <p>Veracruz Me Llena de Orgullo</p>
                    </div>


                    <div className="social-group">
                        <a href="https://x.com/cgeveracruz?lang=es" target="_blank" rel="noopener noreferrer">
                            <img src={TwitterIcon} alt="Twitter" />
                        </a>
                        <a href="https://www.instagram.com/verivai" target="_blank" rel="noopener noreferrer">
                            <img src={InstagramIcon} alt="Instagram" />
                        </a>
                        <p>verivai</p>
                    </div>


                    <div className="social-group">
                        <a href="mailto:uaip@cgever.gob.mx">
                            <img src={MailIcon} alt="Correo" />
                        </a>
                        <p>uaip@cgever.gob.mx</p>
                    </div>


                    <div className="social-group">
                        <a href="https://www.veracruz.gob.mx/" target="_blank" rel="noopener noreferrer">
                            <img src={WebIcon} alt="Web" />
                        </a>
                        <p>veracruz.gob.mx/contraloria</p>
                    </div>
                </div>

            </section>

        </>
    );
}

export default Principal;
