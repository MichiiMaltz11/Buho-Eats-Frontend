import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const MuiSnackbar = ({ open, message, onClose, severity = 'success', type = 'support' }) => {
    // Estilos y configuración según el tipo de Snackbar
    const getSnackbarStyles = () => {
        switch (type) {
            case 'login':
                return {
                    anchorOrigin: { vertical: 'top', horizontal: 'left' },
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',  
                };
            case 'register':
                return {
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    backgroundColor: '#ffebee',  
                    color: '#d32f2f',  
                };
            case 'profile':
                return {
                    anchorOrigin: { vertical: 'top', horizontal: 'left' },
                    backgroundColor: '#ffebee', 
                    color: '#d32f2f',  
                };
            case 'support':
                return {
                    anchorOrigin: { vertical: 'top', horizontal: 'left' },
                    backgroundColor: '#ffebee',  
                    color: '#d32f2f',  
                };
            default:
                return {
                    anchorOrigin: { vertical: 'top', horizontal: 'left' },
                    backgroundColor: '#eeeeee',  // Color por defecto
                    color: '#000000',
                };
        }
    };

    const styles = getSnackbarStyles();

    // Configuración de severidad para el Snackbar
    const alertSeverity = severity === 'success' ? 'success' : 'error';  

    const backgroundColor = alertSeverity === 'success' ? '#5d915f' : styles.backgroundColor;//verde
    const color = alertSeverity === 'success' ? '#ffffff' : styles.color;//blanco

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={styles.anchorOrigin}
        >
            <Alert
                onClose={onClose}
                severity={alertSeverity}  // Aplica la severidad correcta
                sx={{
                    fontSize: '35px',
                    '& .MuiAlert-message': {
                        fontSize: '15px',
                    },
                    '& .MuiAlert-action': {
                        fontSize: '30px',
                        width: '80px',
                        height: '40px',
                    },
                    padding: '6px 12px',
                    backgroundColor: backgroundColor, 
                    color: color, 
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default MuiSnackbar;








        


