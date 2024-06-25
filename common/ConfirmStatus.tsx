import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface DeleteModalProps {
    message: string;
    method: string;
    visible: boolean;
    closeModal: (props?: any) => void;
    id?: any;
    url: string;
}

const ConfirmStatus: React.FC<DeleteModalProps> = ({
    message,
    method,
    visible,
    closeModal,
    id,
    url,
}) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const handleToggle = async (is_active: boolean) => {
        try {
            await service.makeAPICall({
                methodName: method,
                apiUrl: url,
                //  params: id,
                body: {id, is_active},
            });
        } catch (error: any) {
            closeModal(false);
            console.log(error);
        }
        closeModal(true);
    };

    return (
        <Modal
        open={id && visible ? true : false}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
    >
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                maxWidth: 600,
            }}
        >
            <IconButton
                aria-label="close"
                onClick={closeModal}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                }}
            >
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" id="modal-title" align="center">
                {message}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <MDButton
                    variant="contained"
                    color={sidenavColor}
                    onClick={()=>handleToggle(true)}
                    sx={{ mr: 2 }}
                >
                    Active
                </MDButton>
                <MDButton
                    variant="contained"
                    color="secondary"
                    onClick={()=>handleToggle(false)}
                >
                    Inactive
                </MDButton>
            </Box>
        </Box>
    </Modal>
    );
};

export default ConfirmStatus;
