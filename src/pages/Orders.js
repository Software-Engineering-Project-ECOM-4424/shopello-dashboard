import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


// material
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


// components
import Page from '../components/Page';


// ----------------------------------------------------------------------

export default function Orders() {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');


    const [orders, setOrders] = useState([]);

    const columns = [
        { field: 'id', headerName: 'Id', width: 180 },
        { field: 'amount', headerName: 'Amount', width: 180 },
        { field: 'created_at', headerName: 'Created At', width: 180 },
        { field: 'username', headerName: 'User Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 180 },
    ];

    const rows = orders.map((order, i) => {
        return { id: i, amount: order.amount, created_at: order.created_at, username: order.username, email: order.email }
    });

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
        axios({
            method: 'get',
            url: `http://localhost:8000/api/v1/order`,
            headers: { Authorization: token }
        })
            .then(result => {
                setOrders(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken');
                        sessionStorage.removeItem('accessToken');
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('user');
                        return navigate('/login', { replace: true })
                    };
                };
            });
    }, []);

    return (
        <Page title="Dashboard: Product Page">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Orders
                </Typography>

                <div style={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </div>
            </Container>
        </Page>
    );
}
