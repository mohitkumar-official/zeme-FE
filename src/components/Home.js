import React from 'react';
import SideBar from './SideBar';
import PropertiesListing from './PropertiesListing';
import PropertiesState from '../context/properties/PropertiesState';

const Home = () => {
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Reload the page to reflect changes
    };
    return (
        <div>
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo">
                        <img
                            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=50&h=50&q=80"
                            alt="Logo"
                        />
                        <span>zeme</span>
                    </div>
                </div>

                <div className="nav-right">
                    {token ? (
                        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <a href="/login" className="btn btn-login">Log In</a>
                            <a href="/register" className="btn btn-register">Register</a>
                        </>
                    )}
                </div>
            </nav>
            <SideBar />
            <main className="main-content">
                <div className="search-bar">
                    <div className="search-input">
                        <i className="icon">🔍</i>
                        <input type="text" placeholder="Search by address, neighborhood, state, zip" />
                    </div>
                    <div className="search-controls">
                        <button className="btn-filter">
                            <i className="icon">⚙️</i>
                            Filters
                        </button>
                        <button className="btn-sort">
                            <span>Newest to Oldest</span>
                            <i className="icon">▼</i>
                        </button>
                        <div className="view-controls">
                            <button className="btn-view">Map</button>
                            <button className="btn-view active">Table</button>
                        </div>
                    </div>
                </div>
                <PropertiesState>
                    <PropertiesListing />
                </PropertiesState>
            </main>
        </div>
    );
};

export default Home;
