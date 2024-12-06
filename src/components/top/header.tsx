"use client";

import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconDashboard,
  IconFingerprint,
  IconLogout,
  IconNotification,
} from "@tabler/icons-react";
import {
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  Menu,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import classes from "./top-header.module.css";
import { BookIcon } from "@/components/icon/book";
import Link from "next/link";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/components/hooks/useAuth";

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

interface TopHeaderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const TopHeader = ({ children, session }: TopHeaderProps) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const user = session?.user;
  const { handleLogout } = useAuth();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <div>
      <Box pb={50}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link href="/" className={classes.logo}>
              <BookIcon />
              <span>FindArticle</span>
            </Link>

            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar
                    src={user ? user?.user_metadata.avatar_url : "/default.png"}
                    alt={user?.user_metadata.name}
                    className={classes.avatarIcon}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconDashboard
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    <Link href="/dashboard">ダッシューボード</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                      fullWidth
                    >
                      ログアウト
                    </Button>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group visibleFrom="sm">
                <Button component={Link} href="/login" variant="default">
                  ログイン
                </Button>
                <Button component={Link} href="/register">
                  新規登録
                </Button>
              </Group>
            )}

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            <Divider my="sm" />

            <a href="#" className={classes.link}>
              Home
            </a>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  Features
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
              <Button>Sign up</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
      {children}
    </div>
  );
};

export default TopHeader;
