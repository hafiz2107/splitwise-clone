import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Controller } from "react-hook-form";

export default function AutoCompleteInput({
  name,
  control,
  value,
  options,
  label,
  onChangeSelection,
  singleInput,
}) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={value}
        render={({
          field: { ref, onChange, ...field },
          fieldState: { error },
        }) => (
          <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
              multiple={!singleInput}
              id="tags-standard"
              options={options}
              getOptionLabel={(option) => option.username}
              onChange={(_, data) => {
                onChangeSelection(data, name);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label={label} />
              )}
            />
          </Stack>
        )}
      ></Controller>
    </>
  );
}
