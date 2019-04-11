import React from 'react';
import NavBar from './NavBar';

class DashBoard extends React.Component {

    render() {
        if (sessionStorage.getItem('Access')) {
            return (
                <div className="App">
                <NavBar />
                This is DashBoard
                </div>
            );
        }
        return (
            <div className="App">
            <NavBar />
            Please Login
            </div>
        );
    };
};

export default DashBoard