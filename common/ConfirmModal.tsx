import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { service } from "utils/Service/service";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { array } from "yup";

interface ConfirmModalProps {
    message: any;
    method?: string;
    visible: boolean;
    closeModal: (props?: any) => void;
    id?: any;
    url?: string;
    handleFunction?: () => void;
    onSubmit?: (reply: string) => Promise<void>;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    message,
    method,
    visible,
    closeModal,
    handleFunction,
    id,
    url,
    onSubmit,
}) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const handleApiCall = async (method: string, url: string) => {
        try {
            const sendType = Array.isArray(id);
            const paramName = sendType || typeof id === 'object';
            const requestConfig = {
                methodName: method,
                apiUrl: url,
                [paramName ? "body" : "params"]: sendType ? { id } : id

            }

            await service.makeAPICall(requestConfig);

            if (onSubmit) {
                onSubmit('Confirmation reply'); // Assuming a default confirmation reply
            }
        } catch (error: any) {
            closeModal(false);
            console.log(error);
        }
        closeModal(true);
    };

    return (
        <Modal
            open={visible}
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
                <Typography variant="h6" id="modal-title" align="center">
                    {message}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <MDButton
                        variant="contained"
                        color={sidenavColor}
                        onClick={method && url ? () => handleApiCall(method, url) : handleFunction}
                        sx={{ mr: 2 }}
                    >
                        {" "}
                        yes
                    </MDButton>
                    <MDButton
                        variant="contained"
                        color="secondary"
                        onClick={closeModal}
                    >
                        no
                    </MDButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmModal;
