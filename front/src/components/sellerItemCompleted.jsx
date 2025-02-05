import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 96,
  height: 96,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const ChatMessage = styled(Box)(({ theme, isUser }) => ({
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.light : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  maxWidth: '75%',
  marginBottom: theme.spacing(1),
}));

const SellerItemCompleted = ({ order }) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleOpen = async () => {
        setOpen(true);
        try {
            const response = await axios.post(`${baseURL}/chat/messages`, {
                transactionID: order.transactionID
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                setChatMessages(response.data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
            }
        } catch (error) {
            setErrorMessage('Error fetching chat messages');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
        setChatMessages([]);
        setErrorMessage('');
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        
        try {
            const response = await axios.post(`${baseURL}/chat/send`, {
                transactionID: order.transactionID,
                message: message.trim(),
            }, {
                withCredentials: true,
            });

            if (response.data.success) {
                setChatMessages([...chatMessages, { 
                    sender: response.data.sender, 
                    message: message, 
                    timestamp: new Date() 
                }]);
                setMessage('');
            }
        } catch (error) {
            setErrorMessage('Error sending message');
        }
    };

    const formattedDate = new Date(order.dateCompleted).toLocaleString();

    return (
        <StyledCard>
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
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
                        <Typography variant="h6" component="span" color="primary">
                            ₹{order.amount.toLocaleString()}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* Order Details */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                        <ImageContainer>
                            <ProductImage
                                src={order.productID.image}
                                alt={order.productID.name}
                            />
                        </ImageContainer>

                        <Stack spacing={1} flex={1}>
                            <Typography variant="h6">
                                {order.productID.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Buyer: {order.buyerID.firstName} {order.buyerID.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {order.buyerID.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed: {formattedDate}
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={handleOpen}
                            sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                        >
                            Chat with Buyer
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>

            {/* Chat Dialog */}
            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: { height: '80vh' }
                }}
            >
                <DialogTitle>
                    Chat with Buyer
                </DialogTitle>
                <DialogContent>
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            height: 'calc(100% - 100px)',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        {chatMessages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                isUser={msg.sender._id !== order.buyerID._id}
                            >
                                <Typography variant="subtitle2" color="text.secondary">
                                    {msg.sender.firstName} {msg.sender.lastName}
                                </Typography>
                                <Typography variant="body1">
                                    {msg.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </Typography>
                            </ChatMessage>
                        ))}
                    </Box>
                    <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2 }}>
                        <TextField
                            label="Message"
                            variant="outlined"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            error={!!errorMessage}
                            helperText={errorMessage}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Close
                    </Button>
                    <Button 
                        onClick={handleSendMessage} 
                        variant="contained" 
                        disabled={!message.trim()}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledCard>
    );
};

export default SellerItemCompleted;