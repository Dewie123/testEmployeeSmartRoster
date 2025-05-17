import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton/PrimaryButton';
import GuestLanding from '../pages/LandingPage/LandingPage';

import { IoArrowBack } from '../../public/Icons.js'
import './styles.css';
import '../../public/styles/common.css';

function PreviewLanding(){
    const navigate = useNavigate();

    function backPrevPage() {
        navigate(-1);
    }

    return(
        <div className='sa-preview-landing-content'>
            <PrimaryButton
                text='Back'
                onClick={backPrevPage}
            />
            <GuestLanding />
        </div>
    )
}

export default PreviewLanding