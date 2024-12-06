"use client";

import { useForm, isEmail, hasLength } from "@mantine/form";
import { Container, Flex, Space, TextInput } from "@mantine/core";
import AuthClientButton from "@/components/form/auth-client-button";

const LoginForm = () => {
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

  return (
    <Container size="xs">
      <form onSubmit={form.onSubmit(() => {})}>
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
          <AuthClientButton />
        </Flex>
      </form>
    </Container>
  );
};

export default LoginForm;
