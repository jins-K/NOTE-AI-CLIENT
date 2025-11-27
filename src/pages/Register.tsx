import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handle = async () => {
        try {
            await authService.register(email, password);
            nav('/login');
        } catch (e) {
            alert('Registration failed');
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <Card title="Register">
                <Input placeholder="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="mb-3"/>
                <Input placeholder="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="mb-3"/>
                <Button onClick={handle}>Register</Button>
            </Card>
        </div>
    )
}

export default Register;