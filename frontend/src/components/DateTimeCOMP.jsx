import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

function DateTime({value, onChange}){
    const { t } = useTranslation();

    const pickValue = React.useMemo(
        () => (value ? dayjs(value) : null),
        [value]
    );

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
                label = {t("Due Date")}
                value={pickValue}
                onChange={onChange}
                slotProps={{
                    textField: { fullWidth: true }
                }}
                views={['day', 'hours']}
            />
        </LocalizationProvider>
    );
} export default React.memo(DateTime);