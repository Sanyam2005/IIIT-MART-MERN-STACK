import React, { useState } from 'react';
import {Card,CardContent,Typography,Button,Modal,Box,Chip,Avatar, Stack,Divider,Paper} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useEffect } from 'react';
// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '90%',
  textAlign: 'center',
}));

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const ImageContainer = styled(Box)({
  width: 96,
  height: 96,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const OrderItem = ({ order, onRemove }) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [otp, setOtp] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGenerateOtp = async () => {
    try {
      const response = await axios.post(`${baseURL}/order/generate-otp`, {
        orderId: order._id,
      }, {
        withCredentials: true
      });

      if (response.data.otp) {
        setOtp(response.data.otp);
        handleOpen();
      } else {
        console.error('Error generating OTP:', response.data);
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };

  const formattedDate = new Date(order.date).toLocaleString();

  return (
    <StyledCard>
      <CardContent>
        <Stack spacing={2}>
          {/* Order Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Chip
              label={`Order ID: ${order.transactionID}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Typography variant="h6" component="span">
              ₹{order.amount.toLocaleString()}
            </Typography>
          </Stack>

          <Divider />

          {/* Order Details */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <ImageContainer>
              <ProductImage
                src={order.productID.image}
                alt={order.productID.name}
              />
            </ImageContainer>

            <Stack spacing={1} flex={1}>
              <Typography variant="h6" component="h2">
                {order.productID.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller: {order.sellerID.firstName} {order.sellerID.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {formattedDate}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleGenerateOtp}
              sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
            >
              Generate OTP
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      {/* OTP Modal */}
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="otp-modal-title"
      >
        <ModalContent elevation={24}>
          <Typography
            id="otp-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            OTP Generated
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: 'monospace',
              my: 3,
              letterSpacing: 2,
              fontWeight: 'bold',
            }}
          >
            {otp}
          </Typography>
          <Button
            variant="contained"
            onClick={handleClose}
            fullWidth
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </ModalContent>
      </StyledModal>
    </StyledCard>
  );
};

export default OrderItem;