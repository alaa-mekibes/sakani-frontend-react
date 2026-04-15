import { useAuth } from "../../context/AuthContext"
import { Link } from '@tanstack/react-router';
import Logo from "../images/Logo";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import DefaultAvatar from "../images/DefaultAvatar";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <h1><Link to='/'>{<Logo theme={theme} />}</Link></h1>
            </div>
            <div className="navbar-end space-x-2">
                {user ? <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {user?.avatar ? <img
                                alt={user.name}
                                src={user.avatar} /> : <DefaultAvatar className="w-fit h-fit" />}

                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to='/profile/$userId' params={{ userId: user._id }}>Profile</Link></li>
                        <li><Link to='/properties'>Properties</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </ul>
                </div>
                    : <Link to="/login" className="btn">login</Link>}

                <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </div>
    )
}

export default Navbar