// import React, { useState } from 'react';
// import { FaTrashAlt } from 'react-icons/fa';
// import axios from 'axios';
// import Button from '@mui/material/Button';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SendIcon from '@mui/icons-material/Send';
// import Stack from '@mui/material/Stack';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';

// const OrderItemCompleted = ({ order}) => {
//     const baseURL = import.meta.env.VITE_API_URL;
//     const [otp, setOtp] = useState(null);
    

//     const [open, setOpen] = useState(false);
//     const [message, setMessage] = useState('');
//     const [chatMessages, setChatMessages] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');

//     const handleOpen = async () => {
//         setOpen(true);
//         try {
//             const response = await axios.get(`${baseURL}/chat/messages`, {
//                 params: { orderId: order._id },
//                 withCredentials: true
//             });
//             if (response.data.success) {
//                 setChatMessages(response.data.messages);
//             } else {
//                 setErrorMessage('Error fetching chat messages');
//             }
//         } catch (error) {
//             console.error('Error fetching chat messages:', error);
//             setErrorMessage('Error fetching chat messages');
//         }
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setMessage('');
//         setErrorMessage('');
//     };

//     const handleSendMessage = async () => {
//         try {
//             const response = await axios.post(`${baseURL}/chat/send`, {
//                 transactionID: order.transactionID,
//                 message: message,
//             }, {
//                 withCredentials: true
//             });

//             if (response.data.success) {
//                 setChatMessages([...chatMessages, { sender: response.data.sender, message: message, timestamp: new Date() }]);
//             } else {
//                 setErrorMessage('Error sending message');
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//             setErrorMessage('Error sending message');
//         }
//     };


    
//     const formattedDate = new Date(order.dateCompleted).toLocaleString();

//     return (
//         <div className="order-item flex justify-between items-center p-3 border-b">
//             <div className="md:flex items-center gap-4">
//                 <img src={order.productID.image} alt={order.productID.name} className="w-16 h-16 md:w-24 md:h-24 object-contain rounded" />
//                 <div className="flex-1 ml-3">
//                     <p className='text-sm'>Order ID: {order.transactionID}</p>
//                     <h4 className='text-lg font-semibold'>{order.productID.name}</h4>
//                     <p className='text-sm'>Seller: {order.sellerID.firstName} {order.sellerID.lastName}</p>
//                     <p className='text-sm'>Date Completed: {formattedDate}</p>
//                 </div>
//             </div>
//             <div className="">
//                 <p>Rs. {order.amount}</p>
//             </div>
               
//             <Stack direction="row" spacing={2} className="sm:space-x-2">
//                 <Button variant="contained" color="primary" endIcon={<SendIcon />} size="small" onClick={handleOpen}>
//                     Chat with buyer
//                 </Button>
//             </Stack>
//             <Dialog open={open} onClose={handleClose} aria-labelledby="chat-dialog-title">
//                 <DialogTitle id="chat-dialog-title">Chat with Buyer</DialogTitle>
//                 <DialogContent>
//                     <div className="chat-messages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                         {chatMessages.map((msg, index) => (
//                             <Typography key={index} variant="body2" color="primary">
//                                 {msg.sender.firstName} {msg.sender.lastName}: {msg.message}
//                             </Typography>
//                         ))}
//                     </div>
//                     <TextField
//                         label="Message"
//                         variant="outlined"
//                         fullWidth
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         sx={{ mt: 2 }}
//                     />
//                     {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleSendMessage} variant="contained" color="primary">
//                         Send
//                     </Button>
//                     <Button onClick={handleClose} variant="outlined">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default OrderItemCompleted;
import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useRef } from 'react';
import { useEffect } from 'react';
const OrderItemCompleted = ({ order }) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const chatContainerRef = useRef(null);



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
            } else {
                setErrorMessage('Error fetching chat messages');
            }
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            setErrorMessage('Error fetching chat messages');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
        setErrorMessage('');
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(`${baseURL}/chat/send`, {
                transactionID: order.transactionID,
                message: message,
            }, {
                withCredentials: true,
                
            });

            if (response.data.success) {
                console.log(response.data.sender);
                setChatMessages([...chatMessages, { sender: response.data.sender, message: message, timestamp: new Date() }]);
                setMessage('');
            } else {
                setErrorMessage('Error sending message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMessage('Error sending message');
        }
    };
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);
    const formattedDate = new Date(order.dateCompleted).toLocaleString();

    return (
        <div className="order-item flex justify-between items-center p-3 border-b">
            <div className="md:flex items-center gap-4">
                <img src={order.productID.image} alt={order.productID.name} className="w-16 h-16 md:w-24 md:h-24 object-contain rounded" />
                <div className="flex-1 ml-3">
                    <p className='text-sm'>Order ID: {order.transactionID}</p>
                    <h4 className='text-lg font-semibold'>{order.productID.name}</h4>
                    <p className='text-sm'>Seller: {order.sellerID.firstName} {order.sellerID.lastName}</p>
                   
                    <p className='text-sm'>Date of completion: {formattedDate}</p>
                </div>
            </div>
            <div className="">
                <p>Rs. {order.amount}</p>
            </div>
            <Stack direction="row" spacing={2} className="sm:space-x-2">
                <Button variant="contained" color="primary" endIcon={<SendIcon />} size="small" onClick={handleOpen}>
                    Chat with Seller
                </Button>
            </Stack>
            <Dialog open={open} onClose={handleClose} aria-labelledby="chat-dialog-title" fullWidth maxWidth="sm">
                <DialogTitle id="chat-dialog-title">Chat with Seller</DialogTitle>
                <DialogContent>
                    <Box ref={chatContainerRef} className="chat-messages" sx={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {chatMessages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: msg.sender._id !== order.sellerID._id ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.sender._id !== order.sellerID._id ? '#e0f7fa' : '#f1f8e9',
                                    borderRadius: 2,
                                    padding: 1,
                                    maxWidth: '75%',
                                }}
                            >
                                <Typography variant="body2" color="textSecondary">
                                    {msg.sender.firstName} {msg.sender.lastName}
                                </Typography>
                                <Typography variant="body1">
                                    {msg.message}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSendMessage} variant="contained" color="primary">
                        Send
                    </Button>
                    <Button onClick={handleClose} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderItemCompleted;