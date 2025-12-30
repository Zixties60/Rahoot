"use client"

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

interface FontSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const FONTS = [
  { name: "Sarabun", value: "sarabun" },
  { name: "Kanit", value: "kanit" },
  { name: "Pridi", value: "pridi" },
  { name: "Mali", value: "mali" },
  { name: "Itim (Default)", value: "itim" },
]

const FontSelect = ({ label, value, onChange }: FontSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value || ""}
          label={label}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            fontFamily: value ? `var(--font-${value})` : "inherit",
          }}
        >
          {FONTS.map((font) => (
            <MenuItem
              key={font.value}
              value={font.value}
              sx={{
                fontFamily: `var(--font-${font.value})`,
              }}
            >
              {font.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {value && (
        <div
          className="rounded-md border p-4 text-center text-xl"
          style={{ fontFamily: `var(--font-${value})` }}
        >
          Preview: The quick brown fox jumps over the lazy dog. 1234567890
          <br />
          โดยที่ประชาชนแห่งสหประชาชาติได้ยืนยันอีกครั้งไว้ในกฎบัตรถึงศรัทธาในสิทธิมนุษยชนขั้นพื้นฐาน
        </div>
      )}
    </div>
  )
}

export default FontSelect
