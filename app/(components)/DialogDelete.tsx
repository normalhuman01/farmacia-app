import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type DialogDeleteProps = {
  itemToDelete: any;
  handleClose: () => void;
  itemName: string;
  onDelete: () => void;
};

const DialogDelete = ({
  handleClose,
  onDelete,
  itemName,
  itemToDelete,
}: DialogDeleteProps) => {
  return (
    <Dialog open={itemToDelete !== null} onClose={handleClose}>
      <DialogTitle>¿Deseas eliminar {itemName}?</DialogTitle>
      <DialogContent>
        <Typography>
          Recuerda que una vez eliminado no podrás recuperarlo
        </Typography>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          color="error"
          onClick={onDelete}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDelete;
