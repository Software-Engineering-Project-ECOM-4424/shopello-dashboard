import { useState, useEffect } from 'react';
import axios from 'axios';

import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import { Container, Grid, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  const LoginSchema = Yup.object().shape({
    name: Yup.string().min(3).required('name is required'),
    description: Yup.string().min(3).required('description is required'),
    price: Yup.number("price must be a number").min(1).required(),
    category_id: Yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: `${product?.name}`,
      description: `${product?.description}`,
      price: `${product?.price}`,
      category_id: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      axios({
        method: 'put',
        url: `http://localhost:8000/api/v1/products/${id}`,
        data: formik.values,
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
    },
  });
  const { id } = useParams();

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
      });

    axios({
      method: 'get',
      url: `http://localhost:8000/api/v1/products/${id}`,
      headers: { Authorization: token }
    })
      .then(result => {
        setProduct(result.data);
        formik.setFieldValue('name', result.data.name, false);
        formik.setFieldValue('description', result.data.description, false);
        formik.setFieldValue('price', result.data.price);
        formik.setFieldValue('category_id', result.data.category_id, false);
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
  }, []);

  const catItems = categories?.map(cate => {
    return <MenuItem key={cate.id} value={cate.id}>{cate.name}</MenuItem>
  });
  const handleChange = (event) => {
    formik.setFieldValue('category_id', event.target.value, false);
  };

  const handleDelte = () => {
    axios({
      method: 'delete',
      url: `http://localhost:8000/api/v1/products/${id}`,
      headers: { Authorization: token }
    })
      .then(result => {
        navigate('/dashboard/products', { replace: true });
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
  }

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <Page title="Dashboard: Product Page">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Product Page
        </Typography>
        <Grid container spacing={2}>
          <img src={`/static/mock-images/products/${product.image}`} alt={`${product.name}`} width='750px' height='600px' />
          <Grid item columnSpacing={6}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                <TextField
                  fullWidth
                  type="text"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  label="Product Name"
                  sx={{ m: 1 }}
                />

                <TextField
                  fullWidth
                  type="text"
                  {...getFieldProps('description')}
                  label="Description"
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  sx={{ m: 1 }}
                />

                <TextField
                  fullWidth
                  label="Price"
                  {...getFieldProps('price')}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                  sx={{ m: 1 }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ m: 1 }}
                    id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    {...getFieldProps('category_id')}
                    value={formik.values.category_id}
                    onChange={handleChange}
                    id="demo-simple-select"
                    label="Category"
                    sx={{ m: 1 }}
                  >
                    {catItems}
                  </Select>

                </FormControl>


                <Box sx={{ mt: 5 }}>
                  <LoadingButton sx={{ mr: 2 }} size="large" type="submit" variant="contained"  >
                    Update
                  </LoadingButton>
                  <Button sx={{ backgroundColor: '#d7121a', ":hover": { backgroundColor: 'red' } }} size="large" variant="contained" onClick={handleDelte}  >
                    Delete
                  </Button>
                </Box>
              </Form>
            </FormikProvider>

          </Grid>
        </Grid>

      </Container>
    </Page>
  );
}
