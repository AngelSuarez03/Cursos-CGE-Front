import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import '../Principal/Principal.css';
import '../Estilos/PopupMSJ.css';

function PopupMSJBien({ icon, title, message, buttonText, onClose, onClosePrev, onAction, buttonStyle = {}, cardStyle = {}, reloadCursos, openPrev }) {

    const handleButtonClick = async (evento) => {
        evento.preventDefault();
        if (onAction) onAction();
        if (reloadCursos) reloadCursos();
        if (onClose) onClose();
        if (onClosePrev) onClosePrev();
        if (openPrev) openPrev();
    };
    

    return (
        <>

            <div className = "popup-msj-contenedor">
            <Card variant="outlined" sx={{maxHeight:"100%", borderRadius: 5, zIndex: 2, ...cardStyle }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <div className = "contenedor-msj">
                    {icon && <img src={icon} className="IconoCard" alt="Popup Icon" />}
                    <label className="titulo" variant="h4">{title}</label>
                    <label className="mensaje" sx={{ marginTop: 3 }} variant="body2">
                        {message}
                    </label>
                    </div>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleButtonClick}
                        sx={{ backgroundColor: '#E7B756', color: '#1E1E1E', minWidth: 150, marginBottom: 2, ...buttonStyle }}
                        variant="contained"
                    >
                        {buttonText}
                    </Button>
                </CardActions>
            </Card>
            </div>

            

        </>
    );
}

export default PopupMSJBien;
