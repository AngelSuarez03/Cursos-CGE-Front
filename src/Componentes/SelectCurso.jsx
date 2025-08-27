import React, { useState, useEffect } from 'react';
import '../Estilos/SelectCursos.css';
import { Button, } from "@mui/material";
import CardModificar from '../Componentes/CardModificar';
import { API_URL } from '../util/Constantes.js';

function SelectCurso({ onClose, handleOpenPopupUpdateCurso }) {


    const [cursoBuscado, setCursoBuscado] = useState('');

    const [dataCursos, setDataCurso] = useState([]);

    const [dataCursosFiltrados, setCursosFiltrados] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const CursoPerPage = 10;

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

    const reloadCursos = async () => {
        try {
            const response = await fetch(`${API_URL}obtenerCursos`);
            const data = await response.json();
            setDataCurso(data);
        } catch (error) {
            console.error('Error al obtener los registros de curso:', error);
        }
    };

    useEffect(() => {
        const indexOfLastCurso = currentPage * CursoPerPage;
        const indexOfFirstCurso = indexOfLastCurso - CursoPerPage;
    
        const cursosFiltrados = dataCursos
            .filter(curso => 
                curso.nombreCurso.toLowerCase().includes(cursoBuscado.toLowerCase()) ||
                curso.fecha.toLowerCase().includes(cursoBuscado.toLowerCase())
            )
            .slice(indexOfFirstCurso, indexOfLastCurso);
    
        setCursosFiltrados(cursosFiltrados);
    }, [dataCursos, cursoBuscado, currentPage]);

    useEffect(() => {
        reloadCursos();
    }, []);

    const handleObtenerCursos = () => {
        reloadCursos();
    };

    const obtenerId = (idCurso) => {
        window.localStorage.setItem('id', idCurso)
    }
    
    const totalPages = Math.ceil(dataCursos.length / CursoPerPage);

    return (
        <>

            <div className='layout_Select'>

                <header className="header_Select">
                    <h1>Seleccione el curso a modificar:</h1>
                    <label htmlFor='campoBusqueda' className='textoBusqueda'><strong>Buscar Curso: </strong></label>
                    <input type='text' id='campoBusqueda' className='cuadroBusqueda' placeholder='Ingrese el nombre o fecha del curso (Año-Mes-Día)' onChange={(e) => setCursoBuscado(e.target.value)}></input>
                </header>

                <main className="main_Select">
                    {dataCursosFiltrados.length > 0 ? (
                        dataCursosFiltrados.map((curso) => (
                            <div key={curso.idCurso} onClick={() => obtenerId(curso.idCurso)}>
                                <CardModificar
                                    NombreCurso={curso.nombreCurso}
                                    FechaCurso={curso.fecha}
                                    ModalidadCurso={curso.modalidad}
                                    DireccionCurso={curso.direccion}
                                    ExpositorCurso={curso.imparte}
                                    HoraCurso={curso.hora}
                                    Cupo={curso.cupo}
                                    EstatusCupo={curso.estatusCupo}
                                    EstatusCurso={curso.estatusCurso}
                                    TipoCurso={curso.tipo}
                                    Detalles={curso.detalles}
                                    Curso={curso.curso}
                                    ValorCurricular={curso.valorCurricular}
                                    LigaTeams={curso.ligaTeams}
                                    IdCurso={curso.idCurso}
                                    reloadCursos={handleObtenerCursos}
                                    onOpenPopupUpdateCurso={() => handleOpenPopupUpdateCurso(curso)}
                                />
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign:"center", margin:"10px", color:'#FFF' }}>No se encontraron cursos.</p>
                    )}
                </main>
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
                <footer className="footer_Select">
                    <Button variant="contained" sx={{ backgroundColor: '#E7B756', color: "#1E1E1E", marginTop: -2, marginLeft: 3, marginBottom: 3, fontSize: '2vh' }} onClick={onClose}>Cancelar</Button>
                </footer>

            </div>



        </>
    )
}

export default SelectCurso;