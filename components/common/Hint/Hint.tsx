import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Props {
    open: boolean,
    type?: "success" | "error" | "warning",
    setOpen: React.SetStateAction<boolean>,
    message: string,
    vertical?: string,
    horizontal?: string,
}
function Hint({ open, setOpen, message, type = "success", vertical = "bottom", horizontal = "right" }: Props) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (

        <Snackbar
            className="z-50 w-full"
            open={open}
            autoHideDuration={10000}
            onClose={handleClose}
            anchorOrigin={{ vertical, horizontal }}
        >
            {
                <Alert onClose={handleClose} severity={type}>
                    {
                        message === "DEMO" ? <div className='flex flex-col justify-center items-center'>
                            <p className='text-lg font-semibold'>Demo ONLY</p>
                            <p>We cannot guarantee the consistency and availability of data. </p>
                            <p>The Beta version will be released soon!</p>
                        </div>
                            :
                            <div>
                                {message}
                            </div>
                    }


                </Alert>
            }
        </Snackbar>


    )
}

export default Hint