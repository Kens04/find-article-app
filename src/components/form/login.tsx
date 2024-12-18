"use client";

import { useForm, isEmail, hasLength } from "@mantine/form";
import { Container, Flex, Space, TextInput } from "@mantine/core";
import AuthClientButton from "@/components/form/auth-client-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("メールアドレスを入力してください。"),
      password: hasLength(
        { min: 6, max: 12 },
        "パスワードは6文字以上12文字以下で入力してください。"
      ),
    },
  });

  const handleSignIn = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs">
      <form onSubmit={form.onSubmit(handleSignIn)}>
        <TextInput
          label="メールアドレス"
          placeholder="メールアドレス"
          withAsterisk
          mt="md"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <Space h="sm" />
        <TextInput
          label="パスワード"
          placeholder="パスワード"
          withAsterisk
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Space h="md" />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <AuthClientButton text="ログイン" loading={loading} />
        </Flex>
      </form>
    </Container>
  );
};

export default LoginForm;
