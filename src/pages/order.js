import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


// material
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


// components
import Page from '../components/Page';


// ----------------------------------------------------------------------

export default function NewProduct() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
        axios({
            method: 'get',
            url: `http://localhost:8000/api/v1/order`,
        })
            .then(result => {
                setCategories(result.data);
            });
    }, []);

    function setCategory(params) {
        const category = params.value.toString();
        console.log(category, 'this is edit cate')
        console.log(params.row.category_id, 'this is id')
        if (category.length >= 3) {
            axios({
                method: 'put',
                url: `http://localhost:8000/api/v1/categories/${params.row.category_id}`,
                data: { name: category }
            })
                .then(result => {
                    console.log(result.data)
                });
            return { ...params.row, category };
        }
        return { ...params.row }
    }

    const renderDetailsButton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16, backgroundColor: '#2065D1' }}
                    onClick={() => {
                        console.log(params.row.category_id, 'delte')
                        axios({
                            method: 'delete',
                            url: `http://localhost:8000/api/v1/categories/${params.row.category_id}`,
                        })
                            .then(result => {
                                console.log(result.data)
                            });
                    }}
                >
                    prepare
                </Button>
            </strong>
        )
    }

    const orderDetailsButton = (params) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16, backgroundColor: '#2065D1' }}
                    onClick={() => {
                        console.log(params.row.category_id, 'delte')
                        axios({
                            method: 'get',
                            url: `http://localhost:8000/api/v1/order/${params.row.order_id}`,
                        })
                            .then(result => {
                                console.log(result.data)
                            });
                    }}
                >
                    order details
                </Button>
            </strong>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', type: 'number', width: 80, editable: false },
        { field: 'username', headerName: 'Name', type: 'string', width: 160, editable: false },
        { field: 'email', headerName: 'email', type: 'string', width: 160, editable: false },
        { field: 'amount', headerName: 'amount', type: 'string', width: 160, editable: false },
        { field: 'prepare', headerName: 'prepare order', width: 160, renderCell: renderDetailsButton },
        { field: 'order_id', headerName: 'order details', width: 160, renderCell: orderDetailsButton },
        { field: 'category_id', headerName: '', type: 'number', width: 60, editable: false, hide: true, },

    ];
    const [rows, setRows] = useState([])
    useEffect(() => {
        const tempRows = categories.map((cate, i) => {
            return { id: i, username: cate.username, email: cate.email, amount: cate.amount, order_id: cate.id, category_id: cate.id }
        });
        setRows(tempRows);
    }, [categories])


    const [newCate, setNewCate] = useState('');
    const handleAddCate = (e) => {
        setNewCate(e.target.value)
    }


    return (

        <Page title="Dashboard: Product Page">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Categories
                </Typography>

                <Grid container spacing={3}>
                    <div style={{ height: 650, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} />
                    </div>
                </Grid>
            </Container>
        </Page>
    );
}
