import { Button, CardActions, CardContent, CardHeader, Typography, Grid, TextField, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Arrow from '../assets/cerrar2.svg'
import '../Estilos/PopupAgregarCurso.css'
import '../Principal/Principal.css'
import axios from 'axios';
import PopupMSJBien from './PopupMSJBien.jsx';
import ConfirmIcon from '../assets/check.svg';
import ErrorIcon from '../assets/error.svg';
import facebook from '../assets/facebook.svg';
import styled from '@emotion/styled';
import { API_URL } from '../util/Constantes.js';

function PopupCrearCurso({ onClose, onOpenPopupMsj }) {

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [dataTiposCurso, setDataTiposCurso] = useState([])
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    const [errors, setErrors] = useState({});

    const [isError, setIsError] = useState(false);

    const [dataError, setDataError] = useState({
        titulo: '',
        mensaje: ''
    })

    const [selectedFile, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

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
            const tipos = await getTiposCurso();
        };

        fetchTiposCurso();
    }, []);

    const [DataCurso, setDataCurso] = useState({
        nombreCurso: '',
        fecha: '',
        hora: '',
        imparte: '',
        cupo: 0,
        estatusCupo: 0,
        estatusCurso: '',
        modalidad: '',
        direccion: '',
        correoSeguimiento: 'cursos.ivai@gmail.com',
        tipo: '',
        curso: '',
        ligaTeams: '',
        ligaMoodle: '',
        valorCurricular: '',
        detalles: ''
    })

    const handleInputNumbers = (e) => {
        const { name, value } = e.target;

        if (/^[1-9][0-9]*$/.test(value) || value === "") {
            setDataCurso({
                ...DataCurso,
                [name]: value
            });
        } else {
            e.target.value = "";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        //setDataCurso({ ...DataCurso, [name]: value });
        if (name === 'tipo') {
            setDataCurso({ ...DataCurso, tipo: value, imparte: '', curso: ''});
        } else if (name === 'modalidad'){
            if(value === 'Presencial'){
                setDataCurso({ ...DataCurso, modalidad: value, ligaTeams: '', ligaMoodle: '' });
            } else if (value === 'Virtual'){
                setDataCurso({ ...DataCurso, modalidad: value, direccion: '', ligaMoodle: '' });
            } else if (value === 'Autoaprendizaje'){
                setDataCurso({ ...DataCurso, modalidad: value, ligaTeams: '', direccion: '' })
            }
        } else {
            setDataCurso({ ...DataCurso, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const handleInputChangeNombreCurso = (e) => {
        const { name, value } = e.target;

        const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/;

        if (regex.test(value) || value === "") {
            setDataCurso((prevData) => ({
                ...prevData,
                [name]: value
            }));

            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const handleAddConstancia = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFileName(file.name)
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];

                setFile((selectedFile) => ({
                    ...selectedFile,
                    constancia: base64data
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const validateFields = () => {
        const newErrors = {};

        if (!DataCurso.nombreCurso) newErrors.nombreCurso = "El nombre es obligatorio.";

        if (!DataCurso.fecha) newErrors.fecha = "La fecha es obligatoria.";

        if (!DataCurso.hora) newErrors.hora = "La hora es obligatoria."

        if (!DataCurso.modalidad) newErrors.modalidad = "La modalidad es obligatoria.";

        if (!DataCurso.cupo) newErrors.cupo = "El cupo es obligatorio.";

        if (!DataCurso.estatusCurso) newErrors.estatusCurso = "El estado del curso es obligatorio.";

        if (!DataCurso.tipo) newErrors.tipo = "El tipo de capacitación es obligatorio.";

        return newErrors;
    };

    const handleDateInputClick = () => {
        dateInputRef.current.showPicker();
    };

    const handleTimeInputClick = () => {
        timeInputRef.current.showPicker();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationFields = validateFields();

        if (Object.keys(validationFields).length > 0) {
            setErrors(validateFields);
            return;
        }

        const jsonData = {
            data: DataCurso,
            constancia: selectedFile ? selectedFile.constancia : null,
        };

        try {
            const response = await fetch(`${API_URL}registroCurso`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (response.status === 200) {
                onOpenPopupMsj({
                    titulo: 'Curso registrado',
                    mensaje: 'El curso se ha registrado correctamente'
                }, false);
            } else {
                onOpenPopupMsj({
                    titulo: 'Error en el Registro',
                    mensaje: 'Ocurrió un error durante el proceso. Por favor, inténtelo de nuevo más tarde.'
                }, true);
            }
        } catch (error) {
            console.error('Error al registrar el curso:', error);
            onOpenPopupMsj({
                titulo: 'Error del servidor',
                mensaje: 'No se pudo procesar la solicitud. Por favor, inténtelo de nuevo más tarde.'
            }, true);
        }
    };


    const handleClose = () => {
        setIsPopupOpen(false);
        onClose();
    };

    return (
        <>

            <div className='layout_agregar_curso'>
                <header className="header_agregar_curso">
                    <CardHeader
                        sx={{ color: '#FFFFFF', width: '100%', marginLeft: -4 }}
                        title={
                            <Grid container justifyContent='space-between' alignItems='center'>
                                <Grid item>

                                </Grid>
                                <Grid item>

                                </Grid>
                                <Grid item sx={{ alignItems: 'start', marginLeft: -20 }}>
                                    <Typography variant='h4' sx={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 0, textAlign: 'center', maxWidth: 'auto', maxHeight: 'auto' }}>
                                        Agregar Curso
                                    </Typography>
                                </Grid>

                                <Grid item>

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

                <main className="main_agregar_curso">
                    <div className='ScrollAgregar'>

                        <CardContent sx={{ color: '#FFFFFF' }}>
                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Nombre*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant='outlined' size='small' name='nombreCurso'
                                        value={DataCurso.nombreCurso}
                                        onChange={handleInputChangeNombreCurso}
                                        error={!!errors.nombreCurso} helperText={errors.nombreCurso}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Fecha*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth type='date' variant='outlined' size='small' name='fecha' inputRef={dateInputRef} onClick={handleDateInputClick} onChange={handleInputChange}
                                        error={!!errors.fecha} helperText={errors.fecha}
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
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Hora*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth type='time' variant='outlined' size='small' name='hora' inputRef={timeInputRef} onClick={handleTimeInputClick} onChange={handleInputChange}
                                        error={!!errors.hora} helperText={errors.hora} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Modalidad*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='modalidad'
                                        value={DataCurso.modalidad}
                                        error={!!errors.modalidad} helperText={errors.modalidad}

                                        onChange={handleInputChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=''
                                    >
                                        <MenuItem value='Presencial'>Presencial</MenuItem>
                                        <MenuItem value='Virtual'>Virtual</MenuItem>
                                        <MenuItem value='Autoaprendizaje'>Autoaprendizaje</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            {DataCurso.modalidad === 'Presencial' && (
                                <Grid container item xs={12} alignItems="center" spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Dirección:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth variant='outlined' size='small' name='direccion'
                                            onChange={handleInputChange}

                                            sx={{
                                                backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                }
                                            }} />
                                    </Grid>
                                </Grid>
                            )}

                            {DataCurso.modalidad === 'Virtual' && (
                                <Grid container item xs={12} alignItems="center" spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Liga Teams:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth variant='outlined' size='small' name='ligaTeams'
                                            onChange={handleInputChange}
                                            sx={{
                                                backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                }
                                            }} />
                                    </Grid>
                                </Grid>
                            )}

                            {DataCurso.modalidad === 'Autoaprendizaje' && (
                                <Grid container item xs={12} alignItems="center" spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Liga Moodle:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth variant='outlined' size='small' name='ligaMoodle'
                                            onChange={handleInputChange}
                                            sx={{
                                                backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                }
                                            }} />
                                    </Grid>
                                </Grid>
                            )}

                            <Grid container item xs={12} alignItems='center' spacing={2} sx={{ display: DataCurso.tipo === "Jornada" ? "none" : "flex" }}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Persona que imparte el curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant='outlined' size='small' name='imparte'
                                        value={DataCurso.imparte}
                                        onChange={handleInputChange}
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
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Lugares disponibles*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant='outlined' size='small' name='cupo'
                                        error={!!errors.cupo} helperText={errors.cupo}
                                        onInput={handleInputNumbers}
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
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Correo de seguimiento:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant='outlined' placeholder='cursos.ivai@gmail.com' size='small' name='correoSeguimiento'
                                        disabled='true'
                                        value='cursos.ivai@gmail.com'
                                        onChange={handleInputChange} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Estatus*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='estatusCurso'
                                        value={DataCurso.estatusCurso}
                                        error={!!errors.estatusCurso} helperText={errors.estatusCurso}
                                        onChange={handleInputChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=''
                                    >
                                        <MenuItem value='Activo'>Activo</MenuItem>
                                        <MenuItem value='Finalizado'>Finalizado</MenuItem>
                                        <MenuItem value='Cancelado'>Cancelado</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Tipo de capacitación*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='tipo'
                                        value={DataCurso.tipo}
                                        error={!!errors.tipo} helperText={errors.tipo}
                                        onChange={handleInputChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=''
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

                            <Grid container item xs={12} alignItems='center' spacing={2} sx={{ display: DataCurso.tipo === "Jornada" ? "none" : "flex" }}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Curso:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        name='curso'
                                        value={DataCurso.curso}
                                        onChange={handleInputChange}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=''
                                    >
                                        {dataTiposCurso.map((item) => (
                                            <MenuItem value={item} key={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems='center' spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Valor curricular en horas:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth variant='outlined' size='small' name='valorCurricular'
                                        value={DataCurso.valorCurricular}
                                        onChange={handleInputChange} sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }} />
                                </Grid>
                            </Grid>

                            {DataCurso.tipo === 'Jornada' && (
                                <Grid container item xs={12} alignItems="center" spacing={2} marginTop={0}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Detalles:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            name="detalles"
                                            multiline
                                            minRows={3}
                                            value={DataCurso.detalles}
                                            onChange={handleInputChange}
                                            sx={{
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '15px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            <Grid container item xs={12} alignItems='center' spacing={2} sx={{ display: DataCurso.tipo === "Jornada" ? "none" : "flex" }}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Constacia de la capacitación:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        sx={{ marginTop: '1vh', borderRadius: '15px', backgroundColor: '#E7B756', color: '#000' }}
                                        fullWidth
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        {fileName || 'Upload File'}
                                        <VisuallyHiddenInput
                                            type="file"
                                            name='constancia'
                                            id='constancia'
                                            onChange={handleAddConstancia}
                                            multiple
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>

                    </div>
                </main>

                <footer className="footer_agregar_curso">

                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button onClick={handleSubmit} variant='contained' sx={{ width: '10vw', backgroundColor: '#E7B756', color: '#1E1E1E', marginTop: 2}}>Guardar</Button>
                    </CardActions>
                </footer>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay-confirmation-registro">
                    <div className={`popup-confirmation-registro ${isPopupOpen ? 'popup-show' : 'popup-hide'}`}>
                        <PopupMSJBien
                            icon={isError ? ErrorIcon : ConfirmIcon}
                            title={dataError.titulo}
                            message={dataError.mensaje}
                            buttonText="Cerrar"
                            onClose={handleClose}

                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default PopupCrearCurso;
