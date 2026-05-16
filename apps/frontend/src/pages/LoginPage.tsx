import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, Title, TextInput, PasswordInput, Button, Text, Alert, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '@/hooks/useAuth';
import type { LoginInput } from '@/types/user';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const loginMutation = useLogin();
  
  const form = useForm<LoginInput>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters')
    }
  });
  
  const handleSubmit = async (values: LoginInput) => {
    setError('');
    try {
      await loginMutation.mutateAsync(values);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
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
          Welcome Back
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
          
          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="md"
            mb="xl"
            {...form.getInputProps('password')}
          />
          
          <Button
            fullWidth
            size="md"
            type="submit"
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>
        
        <Text ta="center" mt="md">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register">
            Register
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
