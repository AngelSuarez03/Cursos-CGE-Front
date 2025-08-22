import { Button, Card, CardActions, CardContent, SvgIcon, Typography } from "@mui/material";
import check from '../assets/check.svg'
import '../Principal/Principal.css'

function PopupMSJGuardado({ onClose }) {
    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: '35%', minHeight: 500, borderRadius:5 }}>
                <CardContent sx={{ textAlign:'center' }}>
                    <img src={check} className="IconoCard"/>
                    <Typography variant="h4">Modificació Exitosa</Typography>
                    <Typography sx={{ marginTop:3 }} variant="body2">
                        La modificación del curso se ha realizado correctamente.
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent:'center' }}>
                    <Button onClick={onClose} sx={{ backgroundColor: '#E7B756', color:'#1E1E1E', minWidth:150 }} variant="contained">
                        Aceptar
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}

export default PopupMSJGuardado;