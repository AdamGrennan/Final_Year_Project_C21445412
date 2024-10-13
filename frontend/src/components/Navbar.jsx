
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav>
            <Link href="/Main">Main</Link>
            <Link href="/Register">Register</Link>
        </nav>
    );
};

export default Navbar;
