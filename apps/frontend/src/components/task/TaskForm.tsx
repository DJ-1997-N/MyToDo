import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Select, Button, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import type { Task, TaskInput, Priority } from '@/types/task';

interface TaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
}

export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const isEditing = !!task;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const { data: categories = [] } = useCategories();
  
  const form = useForm<TaskInput>({
    initialValues: {
      title: '',
      description: '',
      priority: 'MEDIUM' as Priority,
      dueDate: '',
      categoryId: undefined,
      tags: []
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Title is required')
    }
  });
  
  // 如果是编辑模式，填充表单数据
  useEffect(() => {
    if (task) {
      form.setValues({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate || '',
        categoryId: task.categoryId || undefined,
        tags: task.tags?.map((t) => t.name) || []
      });
    }
  }, [task]);
  
  const handleSubmit = async (values: TaskInput) => {
    try {
      if (isEditing && task) {
        await updateMutation.mutateAsync({ id: task.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Title"
        placeholder="Task title"
        required
        mb="md"
        {...form.getInputProps('title')}
      />
      
      <Textarea
        label="Description"
        placeholder="Task description (optional)"
        mb="md"
        {...form.getInputProps('description')}
      />
      
      <Select
        label="Priority"
        data={[
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' }
        ]}
        mb="md"
        {...form.getInputProps('priority')}
      />
      
      <Select
        label="Category"
        placeholder="Select category"
        data={[
          { value: '', label: 'No category' },
          ...categories.map((cat: any) => ({ value: cat.id, label: cat.name }))
        ]}
        mb="md"
        onChange={(value) => form.setFieldValue('categoryId', value || undefined)}
        value={form.values.categoryId || ''}
        clearable
      />
      
      <DateTimePicker
        label="Due Date"
        placeholder="Pick due date"
        mb="xl"
        value={form.values.dueDate ? new Date(form.values.dueDate) : null}
        onChange={(date) => form.setFieldValue('dueDate', date ? date.toISOString() : '')}
        clearable
      />
      
      <Group justify="flex-end">
        <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </Group>
    </form>
  );
}
