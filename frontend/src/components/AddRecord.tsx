import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from "react";
import { createRecord } from "../api/record_calls";


const RECORD_TYPES = ['Income', 'Bill', 'Tax', 'Other']

interface AddRecordProps {
    name: string | null,
    value: string | number | null
}

export function AddRecord(props: AddRecordProps){
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())
    const [recordType, setRecordType] = useState('');
    const [manualName, setManualName] = useState('');
    const [manualValue, setManualValue] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const isManualEntry = props.name === null && props.value === null;
    const recordName = isManualEntry ? manualName : props.name;
    const recordValue = isManualEntry ? manualValue : props.value;

    async function processRecord(){
        if (
            recordName === null ||
            !recordName.trim() ||
            recordValue === null ||
            recordValue === '' ||
            !recordType ||
            !dateValue
        ) return;

        setSubmitError('');
        setSubmitSuccess('');

        try {
            const response = await createRecord({
                record_name: recordName,
                record_date: dateValue.toDate(),
                record_type: recordType,
                amount: Number(recordValue),
            });

            setSubmitSuccess(JSON.stringify(response, null, 2));
            setManualName('');
            setManualValue('');
            setRecordType('');
            setDateValue(dayjs());
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Unable to add record.');
        }
    }

    const handleTypeChange = (event: SelectChangeEvent) => {
        setRecordType(event.target.value as string);
    }

    return(
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                borderRadius: 3,
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
                '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: 1,
                },
            }}
        >
            <CardContent sx={{ pb: 1.5 }}>
                {isManualEntry ? (
                    <Stack spacing={1.5}>
                        <Typography variant="subtitle1" sx={{fontWeight:600}}>
                            Enter record details
                        </Typography>
                        <TextField
                            label="Record name"
                            value={manualName}
                            onChange={(event) => setManualName(event.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Amount (£)"
                            type="number"
                            value={manualValue}
                            onChange={(event) => setManualValue(event.target.value)}
                            size="small"
                            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                            fullWidth
                        />
                    </Stack>
                ) : (
                    <>
                        <Typography variant="caption" color="text.secondary">
                            Extracted from payslip
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {recordName}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                            £ {recordValue}
                        </Typography>
                    </>
                )}
            </CardContent>
            {submitError && (
                <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
                    {submitError}
                </Alert>
            )}
            {submitSuccess && (
                <Alert severity="success" sx={{ mx: 2, mb: 2 }}>
                    <Typography variant="body2">Record added. Server response:</Typography>
                    <Typography component="pre" variant="body2" sx={{ mb: 0, whiteSpace: 'pre-wrap' }}>
                        {submitSuccess}
                    </Typography>
                </Alert>
            )}
            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    style={{ alignItems: 'stretch' }}
                    sx={{
                        width: '100%',
                    }}
                >
                    <Select
                        size="small"
                        value={recordType}
                        onChange={handleTypeChange}
                        displayEmpty
                        renderValue={(value) => value || 'Record type'}
                        sx={{ minWidth: 140, flex: 1 }}
                    >
                        {RECORD_TYPES.map((val: string) => (
                            <MenuItem key={val} value={val}>{val}</MenuItem>
                        ))}
                    </Select>
                    <DatePicker
                        label="Date"
                        format="DD/MM/YYYY"
                        value={dateValue}
                        onChange={(newVal) => setDateValue(newVal)}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: { xs: '100%', sm: 175 } }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => processRecord()}
                        disabled={
                            recordName === null ||
                            !recordName.trim() ||
                            recordValue === null ||
                            recordValue === '' ||
                            !recordType
                        }
                        sx={{ whiteSpace: 'nowrap', alignSelf: { xs: 'stretch', sm: 'auto' } }}
                    >
                        Add record
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    )
}