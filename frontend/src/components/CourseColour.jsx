import * as React from 'react';
import { MuiColorInput } from "mui-color-input";

function CourseColourField({ value, onChange }) {
  return (
    <MuiColorInput
      label="Course color"
      format="hex"
      value={value}
      onChange={onChange}
      slotProps={{
            htmlInput: { 
                readOnly: true
            }
        }}
    />
  );
} export default React.memo(CourseColourField);