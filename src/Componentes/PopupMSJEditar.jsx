import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import check from '../assets/check.svg';
import '../Principal/Principal.css';

function PopupMSJEditar({ onClose }) {
    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: '20%', minHeight: '50%', borderRadius: 5, zIndex: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <img src={check} className="IconoCard" alt="Success Icon" />
                    <Typography variant="h4">Proceso Exitoso</Typography>
                    <Typography sx={{ marginTop: 3 }} variant="body2">
                        El proceso se ha realizado correctamente. El curso se ha actualizado. 
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={onClose} sx={{ backgroundColor: '#E7B756', color: '#1E1E1E', minWidth: 150, marginBottom: 2 }} variant="contained">
                        Aceptar
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

export default PopupMSJEditar;