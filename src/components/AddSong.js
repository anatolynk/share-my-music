import { AddBoxOutlined, Link } from "@mui/icons-material";
import { Button, InputAdornment, TextField } from "@mui/material";
import React from "react";

function AddSong() {
  return (
    <div>
      <TextField
        placeholder='Add Music URL - youtube or soundcloud'
        fullWidth
        margin='normal'
        type='url'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Link />
            </InputAdornment>
          ),
        }}
      ></TextField>
      <Button variant='contained' color='primary' endIcon={<AddBoxOutlined />}>
        Add
      </Button>
    </div>
  );
}

export default AddSong;
