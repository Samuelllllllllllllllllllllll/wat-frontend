import { useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Chip, MenuItem, Stack, TextField,
} from "@mui/material";

const STATUSES = ["Open", "Close", "Cancel"];

// Shared by "Create course" and "Edit course".
export default function CourseForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    duration: initial?.duration ?? "",
    topics: initial?.topics ?? [],
    price: initial?.price ?? "",
    maxStudent: initial?.maxStudent ?? "",
    status: initial?.status ?? "Open",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Course name is required");
    if (!(Number(form.duration) >= 1) || !Number.isInteger(Number(form.duration)))
      return setError("Duration must be a whole number of days (1 or more)");
    if (form.topics.length === 0) return setError("Add at least one topic (type it and press Enter)");
    if (form.price === "" || Number(form.price) < 0) return setError("Price must be 0 or more");
    if (!(Number(form.maxStudent) >= 1) || !Number.isInteger(Number(form.maxStudent)))
      return setError("Max Student must be a whole number (1 or more)");

    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        duration: Number(form.duration),
        topics: form.topics,
        price: Number(form.price),
        maxStudent: Number(form.maxStudent),
        status: form.status,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Course name" value={form.name} onChange={set("name")} required fullWidth />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Duration (days)" type="number" value={form.duration} onChange={set("duration")} slotProps={{ htmlInput: { min: 1 } }} required fullWidth />
          <TextField label="Price" type="number" value={form.price} onChange={set("price")} slotProps={{ htmlInput: { min: 0 } }} required fullWidth />
          <TextField label="Max Student" type="number" value={form.maxStudent} onChange={set("maxStudent")} slotProps={{ htmlInput: { min: 1 } }} required fullWidth />
        </Stack>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={form.topics}
          onChange={(_, value) => setForm((f) => ({ ...f, topics: value.map((v) => v.trim()).filter(Boolean) }))}
          renderValue={(value, getItemProps) =>
            value.map((option, index) => {
              const { key, ...rest } = getItemProps({ index });
              return <Chip key={key} label={option} size="small" {...rest} />;
            })
          }
          renderInput={(params) => (
            <TextField {...params} label="Topics" helperText="Type a topic and press Enter to add it" />
          )}
        />
        <TextField select label="Status" value={form.status} onChange={set("status")} fullWidth>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : submitLabel}
          </Button>
          <Button onClick={onCancel} disabled={saving}>Cancel</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
