import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './logout.css';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authState';

export function Logout({changeAuthstate}){ //they basically won't see this 
    
    const navigate = useNavigate();

    async function logout(){
        const response = await fetch(`/api/auth/logout`, {
            method: 'DELETE',
            headers: {'content-type': 'application/json'},
        });
        localStorage.removeItem('userName');
        changeAuthstate(AuthState.Unauthenticated);
        navigate('/');
    };

    React.useEffect(() => {
        const fetchData = async () => {
            await logout();
        };
        fetchData();
    }, []);

    return (
        <div>
            <h3>Logging out.......</h3>
        </div>
    );
}