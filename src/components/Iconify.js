import PropTypes from 'prop-types';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';
import {  useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

export default function Iconify({ icon, sx, ...other }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard/products/add-product', { replace: true });
  }
  return <Box onClick={handleClick} component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
