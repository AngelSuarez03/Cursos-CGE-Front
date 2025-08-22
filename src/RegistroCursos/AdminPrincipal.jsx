import rlceImage from '../Imagenes/rlce.webp';
import ivaiImage from '../Imagenes/ivai.webp'
import '../Principal/Principal.css';
import FacebookIcon from '../assets/facebook.svg';
import YoutubeIcon from '../assets/youtube.svg';
import TwitterIcon from '../assets/twitter-x.svg';
import InstagramIcon from '../assets/instagram.svg';
import MailIcon from '../assets/email.svg';
import WebIcon from '../assets/web.svg';
import Ubi from '../assets/ubi.svg'
import RegistroMain from './RegistroMain';
import logout from '../assets/logout.svg'
import { useNavigate } from 'react-router-dom';

function AdminPrincipal() {

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    }

    return (
        <>
            <section className="layout">
                <div className="header">
                    <h1 className="header-title">
                        RLCE Admin Control
                    </h1>
                    <img src={ivaiImage} alt="" className="header-img-left" />
                    
                        <img src={logout} onClick={handleLogout} alt="" className="header-img-right" />
                    
                </div>
                <div className='Main-Admin'>
                    <div className='BotonesAdmin'>
                        <RegistroMain/>
                    </div>
                    <div className="address-container">
                        <p className="dir">
                            Calle Guadalupeee Victoria #7, Zona Centro, C.P. 91000, Xalapa, Veracruz.
                        </p>
                        <a href="https://maps.app.goo.gl/q4NLaByuVnYCrV9RA" target="_blank" rel="noopener noreferrer">
                            <img className="imgUb" src={Ubi} alt="Ubicación" />
                        </a>
                    </div>
                </div>


                <div className="footer">

                    <div className="social-group">
                        <a href="https://www.facebook.com/ivaiveracruz" target="_blank" rel="noopener noreferrer">
                            <img src={FacebookIcon} alt="Facebook" />
                        </a>
                        <a href="https://www.youtube.com/@IVAIVeracruz" target="_blank" rel="noopener noreferrer">
                            <img src={YoutubeIcon} alt="YouTube" />
                        </a>
                        <p>ivaiveracruz</p>
                    </div>


                    <div className="social-group">
                        <a href="https://x.com/VERIVAI" target="_blank" rel="noopener noreferrer">
                            <img src={TwitterIcon} alt="Twitter" />
                        </a>
                        <a href="https://www.instagram.com/verivai" target="_blank" rel="noopener noreferrer">
                            <img src={InstagramIcon} alt="Instagram" />
                        </a>
                        <p>verivai</p>
                    </div>


                    <div className="social-group">
                        <a href="mailto:contacto@verivai.org.mx">
                            <img src={MailIcon} alt="Correo" />
                        </a>
                        <p>contacto@verivai.org.mx</p>
                    </div>


                    <div className="social-group">
                        <a href="https://ivai.org.mx" target="_blank" rel="noopener noreferrer">
                            <img src={WebIcon} alt="Web" />
                        </a>
                        <p>ivai.org.mx</p>
                    </div>
                </div>

            </section>
        </>
    )
}

export default AdminPrincipal;