import React from 'react';
import Navbar from './NavBar';

class Home extends React.Component {

    render() {

        return (
            <div className="App">
                <Navbar />
                This is Home
            </div>
        );
    };
};

export default Home