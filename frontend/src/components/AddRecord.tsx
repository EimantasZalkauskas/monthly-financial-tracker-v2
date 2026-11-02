import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from "react";



interface props {
    name:string,
    value:any
}

export function AddRecord(props:props){
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())

    async function processRecord(){
        console.log(props.name, props.value, dateValue?.toDate())
    }

    return(
        <Card>
            <CardContent>
                <Typography>{props.name}</Typography>
                <Typography>{props.value}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="outlined" size="small" onClick={()=>processRecord()}>Add Record</Button>
                <DatePicker 
                    label='Pick Record Date'
                    value={dateValue}
                    onChange={(newVal)=> setDateValue(newVal)}
                />
            </CardActions>
        </Card>
    )
}