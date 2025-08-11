import React from 'react';

const Header = () => {
    return (
        <header style={styles.header}>
            <h1 style={styles.title}>Renu Sharma Foundation</h1>
            <nav style={styles.nav}>
                <a href="/" style={styles.link}>Home</a>
                <a href="/about" style={styles.link}>About</a>
                <a href="/projects" style={styles.link}>Projects</a>
                <a href="/contact" style={styles.link}>Contact</a>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        background: '#1976d2',
        color: '#fff',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        margin: 0,
        fontSize: '1.8rem'
    },
    nav: {
        display: 'flex',
        gap: '20px'
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem'
    }
};

export default Header;