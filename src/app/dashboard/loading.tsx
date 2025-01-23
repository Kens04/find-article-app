import { IconLoader } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <IconLoader size={40} />
    </div>
  );
}
