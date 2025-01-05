"use client";

import "@mantine/dropzone/styles.css";
import { Button, Container, Flex, TextInput, Title } from "@mantine/core";
import { Text } from "@mantine/core";
import { handleProfileUpdate } from "@/components/todo/action";
import { useState } from "react";
import { supabaseClient } from "@/utils/supabase-client";
import { Session } from "@supabase/auth-helpers-nextjs";
import { User as PrismaUser } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useAuth } from "@/components/hooks/useAuth";

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

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
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

    if (!name.trim()) {
      alert("名前を入力してください");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      // パスワードが入力されている場合のみ、パスワード更新
      if (password) {
        const { error: updateError } = await supabaseClient.auth.updateUser({
          password: password,
        });

        if (updateError) {
          throw new Error(`Failed to update password: ${updateError.message}`);
        }
      }

      // プロフィール情報の更新
      const result = await handleProfileUpdate({
        id: session?.user.id || "",
        name: name.trim(),
        avatar_url: avatarUrl,
      });

      if (result.data) {
        // Supabaseのユーザーメタデータを直接更新
        const { error: metadataError } = await supabaseClient.auth.updateUser({
          data: {
            name: name.trim(),
            avatar_url: avatarUrl,
          },
        });

        if (metadataError) {
          console.error("Error updating Supabase metadata:", metadataError);
        } else {
          console.log("Supabase metadata updated successfully");
        }

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
          <div {...getRootProps()}>
            {previewImage && (
              <Image
                src={previewImage!}
                alt="プレビュー画像"
                width={100}
                height={100}
              />
            )}
            <input
              type="file"
              onChange={(e) => setAvatarUrl(e.target.value[0])}
              {...getInputProps()}
            />
            {!previewImage && (
              <Text>
                ここにアップロードしたい画像をドラッグ&ドロップしてください。
              </Text>
            )}
          </div>
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
