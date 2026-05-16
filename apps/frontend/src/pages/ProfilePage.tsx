import { useState } from 'react';
import { Box, Title, TextInput, Button, Group, Avatar, Alert, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCurrentUser, useUpdateProfile } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateMutation = useUpdateProfile();
  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState<string>('');
  
  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || ''
    }
  });
  
  // 当用户数据加载完成后更新表单
  useState(() => {
    if (user) {
      form.setValues({
        name: user.name || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
  }, [user]);
  
  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    try {
      await updateMutation.mutateAsync(values);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    }
  };
  
  if (isLoading) return <Text>Loading...</Text>;
  if (!user) return <Alert color="red">Please log in to view this page</Alert>;
  
  return (
    <Box>
      <Title order={2} mb="lg">Profile</Title>
      
      <Group mb="xl">
        <Avatar size="xl" radius="xl">
          {user.name?.charAt(0) || user.username.charAt(0)}
        </Avatar>
        <div>
          <Text size="lg" fw={500}>{user.name || user.username}</Text>
          <Text c="dimmed">{user.email}</Text>
        </div>
      </Group>
      
      {error && (
        <Alert color="red" mb="md" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Your name"
          mb="md"
          {...form.getInputProps('name')}
        />
        
        <TextInput
          label="Email"
          placeholder="your@email.com"
          mb="md"
          {...form.getInputProps('email')}
        />
        
        <TextInput
          label="Username"
          placeholder="Username"
          mb="xl"
          disabled
          {...form.getInputProps('username')}
        />
        
        <Button type="submit" loading={updateMutation.isPending}>
          Update Profile
        </Button>
      </form>
    </Box>
  );
}
