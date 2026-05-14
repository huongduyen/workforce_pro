import { useCallback, useEffect, useState, type FormEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  employeeService,
  type Department,
  type DepartmentPayload,
} from "../../services/employeeService";
import { toastifyService } from "../../services/toastifyService";
import { MainLayout } from "../../components/MainLayout";
import { FormActions } from "../Employee/components";
import { nullableText } from "../Employee/helpers";
import { DepartmentTable } from "./component";
import {
  emptyDepartmentForm,
  type DialogState,
  type DepartmentFormState,
  type DepartmentPageProps,
} from "./types";

export function DepartmentPage({ onLogout, onPageChange }: DepartmentPageProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [form, setForm] = useState<DepartmentFormState>(emptyDepartmentForm());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await employeeService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load departments";
      setLoadError(message);
      toastifyService.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreateDialog = () => {
    setForm(emptyDepartmentForm());
    setDialog({ mode: "create" });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
    }
  };

  const openEdit = (department: Department) => {
    setForm({
      name: department.name,
      description: department.description ?? "",
    });
    setDialog({ mode: "edit", id: department.id });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: DepartmentPayload = {
      name: form.name.trim(),
      description: nullableText(form.description),
    };

    try {
      if (dialog?.mode === "edit" && dialog.id) {
        await employeeService.updateDepartment(dialog.id, payload);
        toastifyService.updateSuccess("Department");
      } else {
        await employeeService.createDepartment(payload);
        toastifyService.createSuccess("Department");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (department: Department) => {
    if (!window.confirm(`Delete ${department.name}?`)) {
      return;
    }

    setIsSaving(true);

    try {
      await employeeService.deleteDepartment(department.id);
      toastifyService.deleteSuccess("Department");
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout 
      activeTab="departments" 
      onTabChange={(tab) => onPageChange?.(tab)} 
      onLogout={onLogout}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <Stack>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ color: '#1a1f2e' }}>
              Departments
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              Manage department information
            </Typography>
          </Stack>

          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => void loadData()}
                disabled={isLoading || isSaving}
                aria-label="Refresh"
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {loadError && (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            {loadError}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isSaving}
          sx={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3d92 100%)',
            },
          }}
        >
          New Department
        </Button>

        <Box sx={{ position: "relative" }}>
          {isLoading && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                bgcolor: "rgba(255, 255, 255, 0.7)",
                borderRadius: '12px',
              }}
            >
              <CircularProgress />
            </Stack>
          )}

          <DepartmentTable
            departments={departments}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Stack>

      <Dialog
        open={dialog !== null}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit" ? "Edit department" : "New department"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>
    </MainLayout>
  );
}
