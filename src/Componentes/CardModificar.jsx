import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CardModificar(Props) {
    const navigate = useNavigate();

    const handleConsultarRegistros = (idCurso) => {
        window.localStorage.setItem('id', idCurso);
        window.localStorage.setItem('CupoTotal', Props.Cupo)
        window.localStorage.setItem('CupoRestante', Props.EstatusCupo)
        navigate('/ConsultaRegistros');
    };

    return (
        <>
            {Props.Tipo === 'Jornada' ? (
                <Card variant="elevation" sx={{ maxWidth: '90%', maxHeight: '60%', backgroundColor: '#FFFFF', margin: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                    <CardHeader sx={{ color: '#A8253C', marginLeft: 2 }} title={Props.NombreCurso} titleTypographyProps={{ fontSize: '3vh', fontWeight: 'Bold' }} />
                        <CardContent sx={{ color: '#A8253C', marginLeft: 2, marginTop: -3 }}>
                            <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Modalidad:</b> {Props.ModalidadCurso}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Fecha:</b> {Props.FechaCurso}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Hora:</b> {Props.HoraCurso}</Typography>
                                        <label className="Card-text" variant="body2" style={{ whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: '2.5vh'}}><b>Detalles:</b> <br/>{Props.Detalles}</label>
                        </CardContent>

                        <CardActions>
                            <Button onClick={Props.onOpenPopupUpdateCurso} variant="contained" sx={{ backgroundColor: '#DAC195', color: "#1E1E1E", marginTop: -2, marginLeft: 3, marginBottom: 3, fontSize: '2vh' }}>Modificar</Button>
                            <Button onClick={handleConsultarRegistros} variant="contained" sx={{ backgroundColor: '#DAC195', color: "#1E1E1E", marginTop: -2, marginLeft: 3, marginBottom: 3, fontSize: '2vh' }}>Consultar Registros</Button>
                        </CardActions>
                    </Card>
            ) : (
                <Card variant="elevation" sx={{ maxWidth: '90%', maxHeight: '60%', backgroundColor: '#FFFFF', margin: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                    <CardHeader sx={{ color: '#A8253C', marginLeft: 2 }} title={Props.NombreCurso} titleTypographyProps={{ fontSize: '3vh', fontWeight: 'Bold' }} />
                    <CardContent sx={{ color: '#A8253C', marginLeft: 2, marginTop: -3 }}>
                        <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Persona que imparte el curso:</b> {Props.ExpositorCurso}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Modalidad:</b> {Props.ModalidadCurso}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Fecha:</b> {Props.FechaCurso}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '2.5vh' }}><b>Hora:</b> {Props.HoraCurso}</Typography>
                    </CardContent>

                    <CardActions>
                        <Button onClick={Props.onOpenPopupUpdateCurso} variant="contained" sx={{ backgroundColor: '#DAC195', color: "#1E1E1E", marginTop: -2, marginLeft: 3, marginBottom: 3, fontSize: '2vh' }}>Modificar</Button>
                        <Button onClick={handleConsultarRegistros} variant="contained" sx={{ backgroundColor: '#DAC195', color: "#1E1E1E", marginTop: -2, marginLeft: 3, marginBottom: 3, fontSize: '2vh' }}>Consultar Registros</Button>
                    </CardActions>
                </Card>
            )}

        </>
    );
}

export default CardModificar;