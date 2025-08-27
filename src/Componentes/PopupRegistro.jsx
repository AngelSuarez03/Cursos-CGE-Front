import { Button, Card, CardActions, CardContent, CardHeader, Typography, Grid, TextField, Select, MenuItem, Switch, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import PopupMSJBien from './PopupMSJBien.jsx'
import Arrow from '../assets/cerrar2.svg'
import CargandoIvai from '../Imagenes/Ivaisito2.0.png'
import '../Principal/Principal.css'
import '../Estilos/PopupRegistroCurso.css'
import axios from 'axios';
import ConfirmIcon from '../assets/check.svg';
import ErrorIcon from '../assets/error.svg';
import { API_URL } from '../util/Constantes.js';

function PopupRegistro({ onClose, onOpenPopupMsj, cupo, onReload, isLoading, setIsLoading, cuposRestantes, setCuposRestantes }) {


    const [errors, setErrors] = useState({});

    const [isError, setIsError] = useState(false);

    const [dataError, setDataError] = useState(({
        titulo: '',
        mensaje: ''
    }))

    const [dataRegistro, setDataRegistro] = useState({
        nombre: '',
        apellidos: '',
        gradoDeEstudios: '',
        lugarDeProcedencia: '',
        ordenGobierno: '',
        genero: '',
        tipoSO: '',
        SO: '',
        areaAdscripcion: '',
        cargoPublico: '',
        correo: '',
        telefono: '',
        idCurso: window.localStorage.getItem('id')
    })

    const [dataPadron, setDataPadron] = useState([]);
    const [dataTipoSO, setDataTipoSO] = useState([]);

    const validateFields = () => {
        const newErrors = {};

        if (!dataRegistro.nombre) newErrors.nombre = "El nombre es obligatorio.";
        if (!dataRegistro.apellidos) newErrors.apellidos = "Los apellidos son obligatorios.";
        if (!dataRegistro.gradoDeEstudios) newErrors.gradoDeEstudios = "El último grado de estudios es obligatorio"
        if (!dataRegistro.lugarDeProcedencia) newErrors.lugarDeProcedencia = "El lugar de procedencia es obligatorio"
        if (!dataRegistro.ordenGobierno) newErrors.ordenGobierno = "El orden de gobierno es obligatorio"
        if (!dataRegistro.genero) newErrors.genero = "El género es obligatorio"
        if (!dataRegistro.tipoSO) newErrors.tipoSO = "El tipo de Sujeto Obligado es obligatorio"
        if (!dataRegistro.SO) newErrors.SO = "El Sujeto Obligado es obligatorio"
        if (!dataRegistro.areaAdscripcion) newErrors.areaAdscripcion = "El area de adscripcion es obligatorio"
        if (!dataRegistro.cargoPublico) newErrors.cargoPublico = "El cargo público es obligatorio"
        if (!dataRegistro.correo) {
            newErrors.correo = "El correo electrónico es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(dataRegistro.correo)) {
            newErrors.correo = "El correo no es válido.";
        }
        if (!dataRegistro.telefono) {
            newErrors.telefono = "El teléfono es obligatorio.";
        } else if (!/^\d{10}$/.test(dataRegistro.telefono)) {
            newErrors.telefono = "El teléfono debe tener 10 dígitos.";
        }

        return newErrors;
    };

    const handleRegistration = async () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}registrarse`, dataRegistro);
            setIsLoading(false);

            if (response.data === 'Registro Correcto' && response.status === 200) {
                let cupos = cuposRestantes;
                setCuposRestantes(cupos - 1);
                cuposRestantes = cupos - 1;
                onOpenPopupMsj({
                    titulo: 'Registro Exitoso',
                    mensaje: 'El proceso se ha realizado correctamente. \nLe hemos enviado un correo electrónico con el enlace de acceso, favor de verificar todas las bandejas del correo electrónico.'
                }, false);
                //onReload();
            } else if (response.data === 'Curso lleno' && response.status === 200) {

                onOpenPopupMsj({
                    titulo: 'Curso Lleno',
                    mensaje: 'El curso al que intenta registrarse se encuentra lleno. \nNo es posible procesar su registro.'
                }, true);
            } else if (response.data === 'Correo Existente' && response.status === 200) {
                onOpenPopupMsj({
                    titulo: 'Correo ya registrado',
                    mensaje: 'El correo ya se encuentra registrado en el curso.'
                }, true)
            } else {
                onOpenPopupMsj({
                    titulo: 'Error en el Registro',
                    mensaje: 'Ocurrió un error durante el proceso. Por favor, inténtelo de nuevo más tarde.'
                }, true);
            }
        } catch (error) {
            console.error('Error en el servidor', error);
            setIsLoading(false);
            onOpenPopupMsj({
                titulo: 'Error en el servidor',
                mensaje: 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.'
            }, true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        //setDataRegistro({ ...dataRegistro, [name]: value });
        if (name === 'tipoSO') {
            setDataRegistro({ ...dataRegistro, tipoSO: value, SO: '' });
        } else {
            setDataRegistro({ ...dataRegistro, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const handleSwitchChange = (e) => {
        const { name, type, value, checked } = e.target;
        setDataRegistro({
            ...dataRegistro,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const [estados, setEstados] = useState([]);

    useEffect(() => {

        const obtenerEstados = async () => {
            try {
                const response = await axios.post(`${API_URL}estado`);
                setEstados(response.data);
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        };

        obtenerEstados();
    }, []);

    useEffect(() => {
        const obtenerSO = async () => {
            try {
                const response = await axios.get(`${API_URL}sujetos`)
                const flatData = response.data.flat();
                setDataPadron(flatData);
            } catch (error) {
                console.error('Error al obtener el Padron de Sujetos Obligados');
            }
        };
        obtenerSO();
    }, []);

    useEffect(() => {
        const obtenerTipoSO = async () => {
            try {
                const response = await axios.get(`${API_URL}tipoSujetos`)
                setDataTipoSO(response.data);
            } catch (error) {
                console.error('Error al obtener el Padron de Sujetos Obligados');
            }
        };
        obtenerTipoSO();
    }, []);

    const handleClose = () => {
        setIsPopupOpen(false);
        onClose();
    };

    const handleClosePopup = () => {
        const popup = document.querySelector('.popup-overlay-confirmation');
        if (popup) {
            popup.classList.remove('popup-show');
            popup.classList.add('popup-hide');
            setTimeout(() => {
                setIsPopupOpen(false);
            }, 300);
        }
    };

    return (
        <>
            <div className='layout_registrar_curso'>

                <header className="header_registrar_curso">
                    <CardHeader className="card-header"

                        title={
                            <Grid className='grid-header'>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <label className='lbl-campos-obligatorios' >
                                            Los campos marcados con <br />
                                            asterisco (*) son obligatorios
                                        </label>

                                    </Grid>
                                    <label className='lbl-campos-obligatorios' >
                                        Escribe correctamente tu nombre, ya que se tomara en cuenta para la constancia.
                                    </label>
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

                <main className="main_registrar_curso">
                    <div className='ScrollRegistro'>
                        <CardContent sx={{ color: '#FFFFFF' }}>
                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Nombre(s)*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required name='nombre' fullWidth variant='outlined' size="small" onChange={handleInputChange}   sx={{
                                        backgroundColor: '#FFFFFF', borderRadius: '15px', 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Apellidos*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth name='apellidos' variant="outlined" size="small" onChange={handleInputChange} error={!!errors.apellidos} helperText={errors.apellidos} sx={{
                                        backgroundColor: '#FFFFFF', marginTop: 1, borderRadius: '15px',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>


                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Último grado de estudios*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        name='gradoDeEstudios'
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={handleInputChange}
                                        error={!!errors.gradoDeEstudios} helperText={errors.gradoDeEstudios}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <MenuItem value="Doctorado">Doctorado</MenuItem>
                                        <MenuItem value="Maestría">Maestría</MenuItem>
                                        <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                                        <MenuItem value="Técnico Superior Universitario">Técnico Superior Universitario</MenuItem>
                                        <MenuItem value="Preparatoria">Preparatoria</MenuItem>
                                        <MenuItem value="Secundaria">Secundaria</MenuItem>
                                        <MenuItem value="Primaria">Primaria</MenuItem>
                                        <MenuItem value="Ninguno">Ninguno</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Lugar de procedencia*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name='lugarDeProcedencia' fullWidth variant="outlined" size="small" onChange={handleInputChange} error={!!errors.lugarDeProcedencia} helperText={errors.lugarDeProcedencia} sx={{
                                        backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Orden de gobierno*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        name='ordenGobierno'
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={handleInputChange}
                                        error={!!errors.ordenGobierno} helperText={errors.ordenGobierno}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <MenuItem value="Estatal">Estatal</MenuItem>
                                        <MenuItem value="Municipal">Municipal</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Género*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        name='genero'
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={handleInputChange}
                                        error={!!errors.genero} helperText={errors.genero}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <MenuItem value="Masculino">Masculino</MenuItem>
                                        <MenuItem value="Femenino">Femenino</MenuItem>
                                        <MenuItem value="Prefiero no decirlo">Prefiero No Decirlo</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Nombre de la entidad o dependencia*:</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Select
                                        name='tipoSO'
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={handleInputChange}
                                        value={dataRegistro.tipoSO || ''}
                                        error={!!errors.tipoSO} helperText={errors.tipoSO}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxWidth: 300, 
                                                    maxHeight: 300,
                                                },
                                            },
                                        }}
                                    >
                                        {dataTipoSO.map((t, index) => (
                                            <MenuItem key={index} value={t} sx={{ whiteSpace: 'normal' }}>
                                                {t}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={3}>
                                    <Select
                                        name='SO'
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={handleInputChange}
                                        disabled={!dataRegistro.tipoSO}
                                        value={dataRegistro.SO || ''}
                                        error={!!errors.SO} helperText={errors.SO}
                                        sx={{
                                            backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '15px',
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxWidth: 300, 
                                                    maxHeight: 300,
                                                },
                                            },
                                        }}
                                    >
                                        {dataPadron
                                            .filter(p => dataRegistro.tipoSO === p.tipoSO)
                                            .map((p, index) => (
                                                <MenuItem key={index} value={p.SO} sx={{ whiteSpace: 'normal' }}>
                                                    {p.SO}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Área de adscripcion*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name='areaAdscripcion' fullWidth variant="outlined" size="small" onChange={handleInputChange} error={!!errors.areaAdscripcion} helperText={errors.areaAdscripcion} sx={{
                                        backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Cargo público que desempeña*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name='cargoPublico' fullWidth variant="outlined" size="small" onChange={handleInputChange} error={!!errors.cargoPublico} helperText={errors.cargoPublico} sx={{
                                        backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Correo electrónico institucional*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name='correo' fullWidth variant="outlined" size="small" onChange={handleInputChange} error={!!errors.correo} helperText={errors.correo} sx={{
                                        backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                        }
                                    }} />
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} alignItems="center" spacing={2} marginBottom={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '2vh', fontWeight: 'bold' }}>Teléfono institucional*:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name='telefono' fullWidth variant="outlined" size="small" onChange={handleInputChange} error={!!errors.telefono} helperText={errors.telefono} sx={{
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

                <footer className="footer_registrar_curso">
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button onClick={handleRegistration} variant="contained" sx={{ backgroundColor: '#DAC192', color: "#1E1E1E", marginTop: 2, marginBottom: 2 }}>Enviar registro</Button>
                    </CardActions>
                </footer>
            </div>



        </>
    )
}

export default PopupRegistro;
