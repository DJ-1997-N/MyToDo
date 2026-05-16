import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, Title, TextInput, PasswordInput, Button, Text, Alert, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRegister } from '@/hooks/useAuth';
import type { RegisterInput } from '@/types/user';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const registerMutation = useRegister();
  
  const form = useForm<RegisterInput>({
    initialValues: {
      email: '',
      username: '',
      password: '',
      name: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      username: (value) => (value.length >= 3 ? null : 'Username must be at least 3 characters'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters')
    }
  });
  
  const handleSubmit = async (values: RegisterInput) => {
    setError('');
    try {
      await registerMutation.mutateAsync(values);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa'
      }}
    >
      <Paper shadow="md" p={30} radius="md" style={{ width: '100%', maxWidth: 400 }}>
        <Title order={2} ta="center" mt="md" mb={30}>
          Create Account
        </Title>
        
        {error && (
          <Alert color="red" mb="md" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            size="md"
            mb="md"
            {...form.getInputProps('email')}
          />
          
          <TextInput
            label="Username"
            placeholder="Choose a username"
            size="md"
            mb="md"
            {...form.getInputProps('username')}
          />
          
          <TextInput
            label="Name (Optional)"
            placeholder="Your name"
            size="md"
            mb="md"
            {...form.getInputProps('name')}
          />
          
          <PasswordInput
            label="Password"
            placeholder="At least 8 characters"
            size="md"
            mb="xl"
            {...form.getInputProps('password')}
          />
          
          <Button
            fullWidth
            size="md"
            type="submit"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>
        
        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login">
            Sign In
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
