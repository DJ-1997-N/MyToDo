import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppShell as MantineAppShell,
  Burger,
  Group,
  Title,
  NavLink,
  ActionIcon,
  Avatar,
  Menu,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconHome,
  IconListCheck,
  IconCategory,
  IconUser,
  IconLogout,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';

export default function AppShell() {
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened(!opened)}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3}>My To-Do</Title>
          </Group>
          
          <Group>
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="default" size="lg">
                  <Avatar size="sm" radius="xl">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              
              <Menu.Dropdown>
                <Menu.Label>{user?.name || user?.username}</Menu.Label>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </MantineAppShell.Header>
      
      <MantineAppShell.Navbar p="md">
        <NavLink
          label="Dashboard"
          leftSection={<IconHome size={20} />}
          component={Link}
          to="/dashboard"
          active
        />
        <NavLink
          label="My Tasks"
          leftSection={<IconListCheck size={20} />}
          component={Link}
          to="/dashboard"
        />
        <NavLink
          label="Categories"
          leftSection={<IconCategory size={20} />}
          component={Link}
          to="/categories"
        />
        <NavLink
          label="Profile"
          leftSection={<IconUser size={20} />}
          component={Link}
          to="/profile"
        />
      </MantineAppShell.Navbar>
      
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
