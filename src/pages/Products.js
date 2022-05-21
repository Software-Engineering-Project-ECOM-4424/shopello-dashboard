import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// material
import { Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductList, ProductCartWidget } from '../sections/@dashboard/products';

// ---------------------------------------------------------------------- fetch products from data pase

export default function EcommerceShop() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
    axios({
      method: 'get',
      url: `http://localhost:8000/api/v1/products`,
    })
      .then(result => {
        setProducts(result.data);
      })
  }, [])


  return (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>
        <ProductList products={products} />
        <ProductCartWidget />
      </Container>
    </Page>
  );
}
