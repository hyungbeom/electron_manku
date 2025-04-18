import Calendar from "antd/lib/calendar";

export default function CalendarForm(){
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    return    <Calendar onPanelChange={onPanelChange} style={{height : '100%'}} />
}