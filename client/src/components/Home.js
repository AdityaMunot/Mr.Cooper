import React from 'react';
import Navbar from './NavBar';
import '../style/home.css';

class Home extends React.Component {

    render() {

        return (
            <div className="container">
                <Navbar />
                <div className="container Main">
                    <h1>Mr. Cooper</h1>
                    <hr />
                    <h4> Developed By:</h4>
                    <div className="d-inline-block col-lg-2 offset-lg-1">
                        <h3>inline-block</h3>
                        <p> Aditya Munot </p>
                    </div>
                    <div className="d-inline-block col-lg-2 offset-lg-1">
                        <h3>inline-block</h3>
                        <p> Aditya Munot </p>
                    </div>
                    <div className="d-inline-block col-lg-2 offset-lg-1">
                        <h3>inline-block</h3>
                        <p> Aditya Munot </p>
                    </div>
                    <div className="d-inline-block col-lg-2 offset-lg-1">
                        <h3>inline-block</h3>
                        <p> Aditya Munot </p>
                    </div>
                </div>
            </div>
        );
    };
};

export default Home