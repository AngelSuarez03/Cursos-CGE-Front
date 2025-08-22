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
            <Card variant="elevation" sx={{ maxWidth:'90%', maxHeight: '60%', backgroundColor: '#FFFFF', margin:5, alignItems:'center',justifyContent:'center', borderRadius:5 }}>

                <CardHeader sx={{ color: '#A35494', marginLeft: 2 }} title={Props.NombreCurso} titleTypographyProps={{ fontSize:'3.5vh', fontStyle:'Bold'}}/>
                <CardContent sx={{ color: '#A35494', marginLeft: 2, marginTop: -3 }}>
                    <Typography variant="body2" sx ={{ fontSize:'2.5vh'}}>Persona que imparte el curso : {Props.ExpositorCurso}</Typography>
                    <Typography variant="body2" sx ={{ fontSize:'2.5vh'}}>Modalidad: {Props.ModalidadCurso}</Typography>
                    <Typography variant="body2" sx ={{ fontSize:'2.5vh'}}>Fecha: {Props.FechaCurso}</Typography>
                    <Typography variant="body2" sx ={{ fontSize:'2.5vh'}}>Hora: {Props.HoraCurso}</Typography>
                </CardContent>

                <CardActions>
                    <Button onClick={Props.onOpenPopupUpdateCurso} variant="contained" sx={{ backgroundColor: '#E7B756', color: "#1E1E1E",marginTop:-2, marginLeft:3, marginBottom:3, fontSize:'2vh'  }}>Modificar</Button>
                    <Button onClick={handleConsultarRegistros} variant="contained" sx={{ backgroundColor: '#E7B756', color: "#1E1E1E",marginTop:-2, marginLeft:3, marginBottom:3, fontSize:'2vh'  }}>Consultar Registros</Button>
                </CardActions>
            </Card>
        </>
    );
}

export default CardModificar;