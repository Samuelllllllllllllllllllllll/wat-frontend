import { Chip } from "@mui/material";

const COLORS = { Open: "success", Close: "warning", Cancel: "error" };

export default function StatusChip({ status }) {
  return <Chip label={status} color={COLORS[status] || "default"} size="small" sx={{ flexShrink: 0, ml: 1 }} />;
}
