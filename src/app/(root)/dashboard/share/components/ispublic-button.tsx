"use client";

import { handleIsPublic } from "@/utils/action";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const IsPublicButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const handleClick = async () => {
    try {
      await handleIsPublic({
        id: id,
        isPublic: false,
        sharedAt: new Date(),
      });
      router.refresh();
    } catch (error) {
      console.error("public update failed:", error);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="共有設定" centered>
        <Text ta="center" fw={500} fs="lg">
          共有を解除しますか？
        </Text>
        <Group justify="center" mt="xl">
          <Button onClick={close} color="green" variant="outline">
            いいえ
          </Button>
          <Button onClick={handleClick} color="red">
            はい
          </Button>
        </Group>
      </Modal>
      <Button color="red" onClick={open}>
        共有を解除
      </Button>
    </>
  );
};

export default IsPublicButton;
