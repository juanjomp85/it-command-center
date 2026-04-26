"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; 
import { 
  Container, Typography, TextField, Button, Paper, 
  MenuItem, Box, Divider, List, ListItem, ListItemText, Chip, CircularProgress
} from "@mui/material";

enum TaskPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', CRITICAL = 'CRITICAL' }
interface TaskFormData { title: string; description: string; priority: TaskPriority; }
interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export default function CommandCenterDashboard() {
  // 1. EL ESCUDO CONTRA ERRORES DE HIDRATACIÓN (SSR)
  const [isMounted, setIsMounted] = useState(false);
  
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM
    }
  });
  
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/tasks");
      
      // 1. Verificamos si el servidor devolvió un error (ej. 404 o 500)
      if (!response.ok) {
        const errorText = await response.text(); // Leemos el HTML del error
        console.error("El backend devolvió un error:", response.status, errorText);
        return; // Salimos antes de que intente parsear el JSON
      }

      // 2. Si todo está bien, parseamos el JSON de forma segura
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error de conexión (¿Está el backend encendido?):", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchTasks();
  }, []);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fallo al crear la tarea:", response.status, errorText);
        return;
      }

      reset();
      fetchTasks();
      
    } catch (error) {
      console.error("Error de red al crear tarea:", error);
    }
  };

  // 3. Si el servidor está intentando renderizar, devolvemos un estado de carga
  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 4. Renderizado 100% seguro en el cliente
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
            Crear Tarea
          </Button>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ px: 2, pt: 2 }}>Backlog Actual</Typography>
        <Divider sx={{ my: 2 }} />
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