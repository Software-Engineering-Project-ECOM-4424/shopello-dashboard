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
            url: `http://localhost:8000/api/v1/categories`,
            headers: { Authorization: token }
        })
            .then(result => {
                setCategories(result.data);
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

    function setCategory(params) {
        const category = params.value.toString();
        if (category.length >= 3) {
            axios({
                method: 'put',
                url: `http://localhost:8000/api/v1/categories/${params.row.category_id}`,
                data: { name: category },
                headers: { Authorization: token }
            })
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
                    style={{ marginLeft: 16, backgroundColor: '#d7121a' }}
                    onClick={() => {
                        axios({
                            method: 'delete',
                            url: `http://localhost:8000/api/v1/categories/${params.row.category_id}`,
                            headers: { Authorization: token }
                        })
                            .catch((error) => {
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
                    }}
                >
                    Delete
                </Button>
            </strong>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', type: 'number', width: 80, editable: false },
        { field: 'category', headerName: 'Category', type: 'string', width: 180, editable: true, valueSetter: setCategory, },
        { field: 'delete', headerName: 'Delete Category', width: 160, renderCell: renderDetailsButton },
        { field: 'category_id', headerName: '', type: 'number', width: 60, editable: false, hide: true },

    ];
    const [rows, setRows] = useState([])
    useEffect(() => {
        const tempRows = categories.map((cate, i) => {
            return { id: i, category: cate.name, category_id: cate.id }
        });
        setRows(tempRows);
    }, [categories])


    const [newCate, setNewCate] = useState('');
    const handleAddCate = (e) => {
        setNewCate(e.target.value)
    }

    const handleAddRow = () => {
        setCategories((prevCate) => [...prevCate, { id: 0, name: newCate }]);
        setNewCate('');
        axios({
            method: 'post',
            url: `http://localhost:8000/api/v1/categories`,
            data: { name: newCate },
            headers: { Authorization: token }
        })
            .catch((error) => {
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

    };
    return (
        <Page title="Dashboard: Product Page">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Categories
                </Typography>

                <Grid container spacing={3}>
                    <div style={{ height: 650, width: '50%' }}>
                        <DataGrid rows={rows} columns={columns} />
                    </div>
                    <Grid item>
                        <TextField
                            fullWidth
                            type="text"
                            label="New Category"
                            sx={{ m: 1, width: '70%' }}
                            value={newCate}
                            onChange={handleAddCate}
                        />
                        <Button sx={{ width: '20%', mt: 1, color: 'white', p: 2 }} variant='contained' onClick={handleAddRow}>Add</Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
