import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import check from '../assets/check.svg';
import '../Principal/Principal.css';

function PopupMSJCredencialesInv({onClose}) {

    const procesarFormulario = async (evento) => {
        evento.preventDefault();
        onClose();  
    }

    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: '40%', minHeight: '50%', borderRadius: 5, zIndex: 2, marginLeft: 20}}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <img src={check} className="IconoCard" alt="Success Icon" />
                    <Typography variant="h4">¡Error!</Typography>
                    <Typography sx={{ marginTop: 3 }} variant="body2">
                        El correo o la contraseña son incorrectos
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={procesarFormulario} sx={{ backgroundColor: '#E7B756', color: '#1E1E1E', minWidth: 150, marginBottom: 2 }} variant="contained">
                        Aceptar
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

export default PopupMSJCredencialesInv;