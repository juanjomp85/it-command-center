"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form"; 
import { CreateTaskDTO, ITask, TaskPriority } from "@it-corp/types";
import { 
  Container, Typography, TextField, Button, Paper, 
  MenuItem, Box, Divider, List, ListItem, ListItemText, Chip, CircularProgress
} from "@mui/material";

type TaskFormData = Required<Pick<CreateTaskDTO, "title" | "description" | "priority">>;
type Task = Pick<ITask, "id" | "title" | "description" | "priority">;
const TASKS_QUERY_KEY = ["tasks"] as const;
const API_BASE_URL = "http://localhost:4000";

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
}

async function createTask(payload: TaskFormData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
}

export default function CommandCenterDashboard() {
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM
    }
  });
  const queryClient = useQueryClient();
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      reset();
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (mutationError) => {
      console.error("Fallo al crear la tarea:", mutationError);
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    await createTaskMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom color="primary">
        IT Command Center
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Nueva Tarea</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field}
                label="Título de la tarea" 
                variant="outlined" 
                fullWidth 
                required 
              />
            )}
          />
          
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field}
                label="Descripción detallada" 
                variant="outlined" 
                multiline 
                rows={3} 
                fullWidth 
              />
            )}
          />
          
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field}
                select 
                label="Prioridad" 
                variant="outlined"
                fullWidth
              >
                <MenuItem value={TaskPriority.LOW}>Baja</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>Media</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>Alta</MenuItem>
                <MenuItem value={TaskPriority.CRITICAL}>Crítica</MenuItem>
              </TextField>
            )}
          />

          <Button type="submit" variant="contained" size="large" disableElevation>
            {createTaskMutation.isPending ? "Creando..." : "Crear Tarea"}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ px: 2, pt: 2 }}>Backlog Actual</Typography>
        <Divider sx={{ my: 2 }} />
        {isError && (
          <Typography variant="body2" color="error" sx={{ p: 2 }}>
            Error al cargar tareas: {error instanceof Error ? error.message : "Error desconocido"}
          </Typography>
        )}
        <List>
          {tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No hay tareas pendientes. El equipo está al día.
            </Typography>
          ) : (
            tasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemText 
                  primary={task.title} 
                  secondary={task.description || "Sin descripción"} 
                />
                <Chip 
                  label={task.priority} 
                  color={task.priority === 'CRITICAL' ? 'error' : 'primary'} 
                  size="small" 
                  variant="outlined"
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}