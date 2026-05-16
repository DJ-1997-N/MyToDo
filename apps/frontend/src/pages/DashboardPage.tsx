import { useState } from 'react';
import {
  Box,
  Title,
  Button,
  Group,
  LoadingOverlay,
  Alert,
  Modal,
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Badge,
  ActionIcon,
  Menu,
  Pagination
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconEdit,
  IconTrash,
  IconCheck,
  IconCircle,
  IconProgress,
  IconArchive
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useTasks, useDeleteTask, useCompleteTask } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import type { Task, TaskFilter, TaskStatus, Priority } from '@/types/task';
import TaskForm from '@/components/task/TaskForm';

export default function DashboardPage() {
  const [filter, setFilter] = useState<TaskFilter>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  
  const [opened, { open, close }] = useDisclosure(false);
  
  const { data, isLoading, error } = useTasks({ ...filter, page, limit: 10 });
  const deleteMutation = useDeleteTask();
  const completeMutation = useCompleteTask();
  const { data: categories = [] } = useCategories();
  
  const handleCreate = () => {
    setEditingTask(null);
    open();
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    open();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteMutation.mutateAsync(id);
    }
  };
  
  const handleComplete = async (id: string) => {
    await completeMutation.mutateAsync(id);
  };
  
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <IconCheck size={16} color="green" />;
      case 'IN_PROGRESS':
        return <IconProgress size={16} color="blue" />;
      case 'ARCHIVED':
        return <IconArchive size={16} color="gray" />;
      default:
        return <IconCircle size={16} color="gray" />;
    }
  };
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'blue';
      default: return 'gray';
    }
  };
  
  if (isLoading) return <LoadingOverlay visible />;
  if (error) return <Alert color="red">Failed to load tasks</Alert>;
  
  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Title order={2}>My Tasks</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Add Task
        </Button>
      </Group>
      
      {/* 过滤器 */}
      <Card mb="lg" p="sm">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              placeholder="Search tasks..."
              leftSection={<IconSearch size={16} />}
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              placeholder="Filter by status"
              value={filter.status || ''}
              onChange={(value) => setFilter({ ...filter, status: value as TaskStatus || undefined })}
              data={[
                { value: '', label: 'All Status' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' }
              ]}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              placeholder="Filter by category"
              value={filter.categoryId || ''}
              onChange={(value) => setFilter({ ...filter, categoryId: value || undefined })}
              data={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat: any) => ({ value: cat.id, label: cat.name }))
              ]}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* 任务列表 */}
      {!data?.tasks || data.tasks.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          No tasks found. Create your first task!
        </Text>
      ) : (
        <>
          {data.tasks.map((task: Task) => (
            <Card key={task.id} mb="sm" p="md" withBorder>
              <Group justify="space-between">
                <Group>
                  <ActionIcon
                    variant={task.status === 'COMPLETED' ? 'filled' : 'light'}
                    color="green"
                    onClick={() => handleComplete(task.id)}
                  >
                    {getStatusIcon(task.status)}
                  </ActionIcon>
                  
                  <Box>
                    <Text
                      fw={500}
                      td={task.status === 'COMPLETED' ? 'line-through' : undefined}
                      c={task.status === 'COMPLETED' ? 'dimmed' : undefined}
                    >
                      {task.title}
                    </Text>
                    {task.description && (
                      <Text size="sm" c="dimmed">
                        {task.description}
                      </Text>
                    )}
                    <Group gap="xs" mt="xs">
                      <Badge color={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge color={task.category.color}>
                          {task.category.name}
                        </Badge>
                      )}
                      {task.dueDate && (
                        <Text size="xs" c="dimmed">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </Group>
                  </Box>
                </Group>
                
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card>
          ))}
          
          {/* 分页 */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <Group justify="center" mt="lg">
              <Pagination
                value={page}
                onChange={setPage}
                total={data.pagination.totalPages}
              />
            </Group>
          )}
        </>
      )}
      
      {/* 任务表单模态框 */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSuccess={() => {
            close();
            setEditingTask(null);
          }}
        />
      </Modal>
    </Box>
  );
}
