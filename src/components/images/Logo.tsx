import lightLogo from '../../assets/sakani logo white.png'
import darkLogo from '../../assets/sakani logo black.png'

const Logo = ({ theme }: { theme: 'light' | 'dracula' }) => {
    return (
        <img src={theme === 'light' ? lightLogo : darkLogo} width={120} height={40} className='hover:scale-75 transition' alt="Sakani logo" />
    )
}

export default Logo