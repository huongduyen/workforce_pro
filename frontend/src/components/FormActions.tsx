import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  CircularProgress,
  DialogActions,
} from "@mui/material";

interface FormActionsProps {
  isSaving: boolean;
  onClose: () => void;
}

export function FormActions({ isSaving, onClose }: FormActionsProps) {
  return (
    <DialogActions>
      <Button
        type="button"
        startIcon={<CloseIcon />}
        onClick={onClose}
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={isSaving ? <CircularProgress size={18} /> : <SaveIcon />}
        disabled={isSaving}
      >
        Save
      </Button>
    </DialogActions>
  );
}
