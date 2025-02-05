import React, { useState } from 'react';
import { 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Typography, 
    Modal, 
    Box, 
    TextField, 
    Divider 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellerItemPending = ({ order, onRemove }) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const Navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOtp('');
        setErrorMessage('');
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${baseURL}/order/verify-otp`, {
                orderId: order._id,
                otp: otp,
            }, {
                withCredentials: true
            });

            if (response.data.message === 'OTP verified') {
                setErrorMessage('OTP verified successfully');
                Navigate('/sell/completed');
            } else {
                setErrorMessage('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorMessage('Error verifying OTP');
        }
    };

    const formattedDate = new Date(order.date).toLocaleString();

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                mb: 2, 
                borderRadius: 2,
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: 3
                }
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                <img 
                    src={order.productID.image} 
                    alt={order.productID.name} 
                    style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'contain', 
                        borderRadius: 8, 
                        marginRight: 16 
                    }} 
                />
                <div>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Order ID: {order.transactionID}
                    </Typography>
                    <Typography variant="h6" component="div">
                        {order.productID.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Buyer: {order.buyerID.firstName} {order.buyerID.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Email: {order.buyerID.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Date: {formattedDate}
                    </Typography>
                </div>
            </CardContent>
            
            <Divider />
            
            <CardActions 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    px: 2, 
                    py: 1 
                }}
            >
                <Typography variant="h6" color="primary">
                ₹ {order.amount}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    endIcon={<SendIcon />} 
                    onClick={handleOpen}
                >
                    Verify OTP
                </Button>
            </CardActions>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="otp-modal-title"
                aria-describedby="otp-modal-description"
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 300, 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography id="otp-modal-title" variant="h6" component="h2" gutterBottom>
                        Enter OTP
                    </Typography>
                    <TextField
                        label="OTP"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    {errorMessage && (
                        <Typography 
                            color={errorMessage.includes('successfully') ? 'success.main' : 'error'} 
                            sx={{ mt: 2 }}
                        >
                            {errorMessage}
                        </Typography>
                    )}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mt: 2 
                    }}>
                        <Button 
                            onClick={handleVerifyOtp} 
                            color="primary" 
                            variant="contained"
                        >
                            Verify
                        </Button>
                        <Button 
                            onClick={handleClose} 
                            variant="outlined"
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    );
};

export default SellerItemPending;