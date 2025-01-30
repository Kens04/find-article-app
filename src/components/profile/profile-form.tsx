"use client";

import "@mantine/dropzone/styles.css";
import {
  Button,
  Container,
  Flex,
  Group,
  rem,
  TextInput,
  Title,
} from "@mantine/core";
import { Text } from "@mantine/core";
import { handleProfileUpdate } from "@/components/article/action";
import { useState } from "react";
import { supabaseClient } from "@/utils/supabase-client";
import { Session } from "@supabase/auth-helpers-nextjs";
import { User as PrismaUser } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useAuth } from "@/components/hooks/useAuth";
import { IconUpload } from "@tabler/icons-react";
import classes from "./profile.module.css";

interface ProfileFormProps {
  session: Session | null;
  user: PrismaUser | null;
}

const ProfileForm = ({ session, user }: ProfileFormProps) => {
  const { handleLogout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.avatarUrl || null
  );

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      if (avatarUrl) {
        const fileName = avatarUrl.split("/avatars/").slice(-1)[0];

        // 古い画像を削除
        await supabaseClient.storage.from("avatars").remove([`${fileName}`]);
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const onDrop = async (files: File[]) => {
    if (files.length !== 1) {
      alert("画像は一つしかアップロード出来ません。");
      return;
    }

    const droppedImage = files[0];

    try {
      // プレビュー用の設定
      const reader = new FileReader();
      reader.readAsDataURL(droppedImage);
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };

      // Supabaseへのアップロード
      const publicUrl = await handleImageUpload(droppedImage);
      if (publicUrl) {
        setAvatarUrl(publicUrl);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error handling image:", error);
      alert("画像のアップロードに失敗しました");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: false,
    onDrop: onDrop,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user?.id) {
      alert("ログインが必要です");
      return;
    }

    try {
      // パスワード更新（必要な場合のみ）
      if (password) {
        if (password !== confirmPassword) {
          alert("パスワードが一致しません");
          return;
        }

        const { error: updateError } = await supabaseClient.auth.updateUser({
          password: password,
        });

        if (updateError) {
          throw new Error(`Failed to update password: ${updateError.message}`);
        }
      }

      // プロフィール情報の更新
      const result = await handleProfileUpdate({
        id: session.user.id,
        name: name.trim(),
        avatar_url: avatarUrl,
      });

      if (result.data) {
        await supabaseClient.auth.updateUser({
          data: {
            name: name.trim(),
            avatar_url: avatarUrl,
          },
        });

        alert("プロフィールを更新しました");
        handleLogout();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("更新に失敗しました");
    }
  };

  return (
    <Container w="100%" mt="lg">
      <Title order={2} mb="md" ta="center">
        プロフィール編集
      </Title>
      <Container size="xl" w="100%" mt="lg" p={0}>
        <form onSubmit={handleSubmit}>
          <Group
            {...getRootProps()}
            className={classes.dropzoneStyle}
            justify="center"
            align="center"
          >
            <Group
              justify="center"
              gap="xl"
              style={{ minHeight: rem(100), pointerEvents: "none" }}
            >
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="プレビュー画像"
                  width={100}
                  height={100}
                  className={classes.imagePreviewStyle}
                />
              ) : (
                <Group justify="center" gap="xl" style={{ minHeight: rem(80) }}>
                  <div className={classes.dropzoneText}>
                    <Group justify="center">
                      <IconUpload size={40} />
                    </Group>
                    <Text size="sm" c="dimmed" inline mt="sm">
                      ここにアップロードしたい画像をドラッグ&ドロップしてください
                    </Text>
                    <Text size="xs" c="dimmed" inline mt={7}>
                      PNG, JPG, WEBP形式（最大2MB）
                    </Text>
                  </div>
                </Group>
              )}
            </Group>
            <input {...getInputProps()} />
          </Group>
          <TextInput
            name="name"
            label="お名前"
            placeholder="お名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            withAsterisk
            mt="sm"
          />
          <TextInput
            type="password"
            label="パスワード"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            withAsterisk
            mt="sm"
          />
          <TextInput
            type="password"
            label="確認用パスワード"
            placeholder="確認用パスワード"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            withAsterisk
            mt="sm"
          />
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            mt="md"
          >
            <Button type="submit">更新</Button>
          </Flex>
        </form>
      </Container>
    </Container>
  );
};

export default ProfileForm;
