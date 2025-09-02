import { Button, CardActions, CardContent, CardHeader, Typography, Grid, TextField, Select, MenuItem } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import '../Principal/Principal.css'
import Arrow from '../assets/cerrar2.svg'
import Axios from 'axios';
import { API_URL } from '../util/Constantes.js';

function PopupModificarCurso({ onClose, nombreCurso, fecha, hora, modalidad, direccion, imparte, cupo, estatusCupo, estatusCurso, tipoCurso, curso, valorCurricular, ligaTeams, closePrev, onOpenPopupMsj }) {
    const [errors, setErrors] = useState({});
    const [dataTiposCurso, setDataTiposCurso] = useState([])
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    const getTiposCurso = async () => {
        try {
            const response = await fetch(`${API_URL}tipos`);
            const data = await response.json();
            setDataTiposCurso(data);
        } catch (error) {
            console.error('Error al obtener los tipos de curso:', error);
        }
    };

    useEffect(() => {
        const fetchTiposCurso = async () => {
            getTiposCurso();
        };

        fetchTiposCurso();
    }, []);

    
    closePrev();

    const [formData, setFormData] = useState({
        nombreCurso: nombreCurso,
        fecha: fecha,
        hora: hora,
        imparte: imparte,
        cupo: cupo,
        estatusCupo: estatusCupo,
        estatusCurso: estatusCurso,
        modalidad: modalidad,
        direccion: direccion,
        correoSeguimiento: 'cursos.ivai@gmail.com',
        tipo: tipoCurso,
        curso: curso,
        ligaTeams: ligaTeams,
        valorCurricular: valorCurricular,
        idCurso: window.localStorage.getItem('id')
    });

    const validateFields = () => {
        const newErrors = {};

        if (!formData.nombreCurso) newErrors.nombreCurso = "El nombre es obligatorio.";
        if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";
        if (!formData.hora) newErrors.hora = "La hora es obligatoria.";
        if (!formData.imparte || formData.imparte.trim() === '') newErrors.imparte = "La persona que imparte el curso es obligatoria.";
        // if (!formData.estatusCupo) newErrors.estatusCupo = "El cupo es obligatorio.";
        if (!formData.estatusCurso) newErrors.estatusCurso = "El estado del curso es obligatorio.";
        if (!formData.modalidad) newErrors.modalidad = "La modalidad es obligatoria.";
        if (!formData.tipoCurso) newErrors.tipoCurso = "El tipo de curso es obligatorio.";
        if (!formData.curso) newErrors.curso = "El curso es obligatorio.";
        if (!formData.valorCurricular) newErrors.valorCurricular = "El valor curricular es obligatorio.";

        return newErrors;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }))

        setErrors(errors => ({
            ...errors,
            [name]: '',
        }))
    };

    const handleSubmit = async () => {
        let finalFormData = { ...formData };

        if (formData.modalidad === 'Presencial') {
            finalFormData.ligaTeams = '';
        } else if (formData.modalidad === 'Virtual') {
            finalFormData.direccion = '';
        }

        const validationErrors = validateFields();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }

        try {
            const response = await Axios.put(`${API_URL}actualizar`, finalFormData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            onOpenPopupMsj();
        } catch (error) {
            console.error('Error al actualizar el curso:', error);
            setIsPopupOpen(true);
        }
    };

    const handleDateInputClick = () => {
        dateInputRef.current.showPicker();
    };

    const handleTimeInputClick = () => {
        timeInputRef.current.showPicker();
    };

    return (
        <>
            <div className='layout_Modificar_Curso'>

                <header className="header_Modificar_Curso">
                    <CardHeader
                        title={
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>

                                </Grid>
                                <Grid item>

                                </Grid>


                                <Grid item sx={{ alignItems: 'start' }}>
                                    <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '4vh', marginBottom: 0, textAlign: 'center', maxWidth: 'auto', maxHeight: 'auto', paddingRight: '3vw' }}>
                                        Modificar Curso
                                    </Typography>
                                </Grid>


                                <Grid item sx={{ marginRight: "1vw" }}>

                                    <img
                                        src={Arrow}
                                        alt="Web"
                                        className='IconoSalir'
                                        onClick={onClose}
                                    />
                                </Grid>
                            </Grid>
                        }
                    />
                </header>

                <main className="main_Modificar_Curso">
                    <div className='ScrollRegistro2'>
                        <CardContent sx={{ color: '#FFFFFF' }}>
                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF',  fontSize: '2vh', fontWeight: 'bold' }}>Nombre del Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        name="nombreCurso"
                                        value={formData.nombreCurso}
                                        onChange={handleChange}
                                        error={!!errors.nombreCurso}
                                        helperText={errors.nombreCurso}
                                        sx={{
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '15px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Fecha:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" size="small"
                                        name="fecha"
                                        type='date'
                                        value={formData.fecha}
                                        inputRef={dateInputRef}
                                        onClick={handleDateInputClick}
                                        onChange={handleChange}
                                        error={!!errors.fecha}
                                        helperText={errors.fecha}
                                        sx={{
                                            backgroundColor: '#FFFFFF', marginTop: 1, borderRadius: '15px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Hora:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" size="small"
                                        name="hora"
                                        value={formData.hora}
                                        type='time'
                                        onChange={handleChange}
                                        inputRef={timeInputRef}
                                        onClick={handleTimeInputClick}
                                        error={!!errors.hora}
                                        helperText={errors.hora}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF',  fontSize: '2vh', fontWeight: 'bold' }}>Modalidad:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='modalidad'
                                        value={formData.modalidad}
                                        onChange={handleChange}
                                        error={!!errors.modalidad}
                                        helperText={errors.modalidad}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue='modalidad'
                                    >
                                        <MenuItem value='Presencial'>Presencial</MenuItem>
                                        <MenuItem value='Virtual'>Virtual</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            {formData.modalidad === 'Presencial' && (
                                <Grid container item xs={12} alignItems="center" spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Dirección:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth variant='outlined' size='small' value={formData.direccion} name='direccion'
                                            onChange={handleChange} sx={{
                                                backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                }
                                            }} />
                                    </Grid>
                                </Grid>
                            )}

                            {formData.modalidad === 'Virtual' && (
                                <Grid container item xs={12} alignItems="center" spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">Liga Teams:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth variant='outlined' size='small' value={formData.ligaTeams} name='ligaTeams'
                                            onChange={handleChange} sx={{
                                                backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                }
                                            }} />
                                    </Grid>
                                </Grid>
                            )}

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Persona que Imparte el Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" size="small" name="imparte"
                                        value={formData.imparte}
                                        error={!!errors.imparte}
                                        helperText={errors.imparte}
                                        onChange={handleChange} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Lugares Disponibles:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" size="small"
                                        name="estatusCupo"
                                        value={formData.cupo}
                                        onChange={handleChange}
                                        error={!!errors.cupo}
                                        helperText={errors.cupo} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Correo de Seguimiento:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" placeholder='cursos.ivai@gmail.com' disabled={true} size="small"
                                        name="correoSeguimiento"
                                        value={formData.correoSeguimiento}
                                        onChange={handleChange} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Estatus Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name="estatusCurso"
                                        value={formData.estatusCurso}
                                        onChange={handleChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue='estatusCurso'
                                    >
                                        <MenuItem value='Activo'>Activo</MenuItem>
                                        <MenuItem value='Finalizado'>Finalizado</MenuItem>
                                        <MenuItem value='Cancelado'>Cancelado</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Tipo Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='tipo'
                                        value={formData.tipo}
                                        onChange={handleChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue='tipoCurso'
                                    >
                                        <MenuItem value='Conferencia'>Conferencia</MenuItem>
                                        <MenuItem value='Cursos'>Curso</MenuItem>
                                        <MenuItem value='Foro'>Foro</MenuItem>
                                        <MenuItem value='Jornada'>Jornada</MenuItem>
                                        <MenuItem value='Taller'>Taller</MenuItem>
                                        <MenuItem value='Segundo Trimestre 2017'>Segundo Trimestre 2017</MenuItem>
                                        <MenuItem value='Otro'>Otro</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='curso'
                                        value={formData.curso}
                                        onChange={handleChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue='curso'
                                    >
                                        {dataTiposCurso.map((item) => (
                                            <MenuItem value={item} key={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF',  fontSize: '2vh', fontWeight: 'bold' }}>Valor Curricular en Horas:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant="outlined" size="small"
                                        name="valorCurricular"
                                        value={formData.valorCurricular}
                                        onChange={handleChange}
                                        error={!!errors.valorCurricular}
                                        helperText={errors.valorCurricular} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>
                        </CardContent>

                    </div>

                </main>

                <footer className="footer_Modificar_Curso">

                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button onClick={handleSubmit} variant="contained" sx={{ width: '10vw', backgroundColor: '#DAC195', color: "#1E1E1E", marginTop: 2 }}>Guardar</Button>
                    </CardActions>
                </footer>

            </div>
        </>
    )
}

export default PopupModificarCurso;