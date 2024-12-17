"use client";

import { useForm, isEmail, hasLength } from "@mantine/form";
import { Container, Flex, TextInput } from "@mantine/core";
import AuthClientButton from "@/components/form/auth-client-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: hasLength(
        { min: 1, max: 12 },
        "お名前は1文字以上12文字以下で入力してください。"
      ),
      email: isEmail("メールアドレスを入力してください。"),
      password: hasLength(
        { min: 6, max: 12 },
        "パスワードは6文字以上12文字以下で入力してください。"
      ),
    },
  });

  const handleSignUp = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs">
      <form onSubmit={form.onSubmit(handleSignUp)}>
        <TextInput
          label="お名前"
          placeholder="お名前"
          withAsterisk
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          type="email"
          label="メールアドレス"
          placeholder="メールアドレス"
          withAsterisk
          mt="sm"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          type="password"
          label="パスワード"
          placeholder="パスワード"
          withAsterisk
          mt="sm"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          mt="md"
        >
          <AuthClientButton text="新規登録" loading={loading}  />
        </Flex>
      </form>
    </Container>
  );
};

export default RegisterForm;
