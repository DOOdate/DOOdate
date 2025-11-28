import * as React from 'react';
import { MuiColorInput } from "mui-color-input";
import { useTranslation } from 'react-i18next';

function CourseColourField({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <MuiColorInput
      label={t("Course color")}
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