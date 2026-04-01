import { useAuth } from "../../context/AuthContext"
import { Link } from '@tanstack/react-router';
import Logo from "../images/Logo";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <h1><Link to='/' className="btn btn-ghost text-xl">{<Logo theme={theme} />}</Link></h1>
            </div>
            <div className="navbar-end space-x-2">
                {user ? <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
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