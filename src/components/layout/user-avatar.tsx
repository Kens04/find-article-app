import { Avatar, Group } from "@mantine/core";
import classes from "./dashboard.module.css";

interface UserAvatarProps {
  avatarUrl: string;
  userName: string;
}

export const UserAvatar = ({ avatarUrl, userName }: UserAvatarProps) => {
  return (
    <Group className={classes.avatarIcon}>
      <Avatar src={avatarUrl} alt={userName} />
      <span>{userName}</span>
    </Group>
  );
};