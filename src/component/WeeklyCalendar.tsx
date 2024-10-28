
import React, { useState } from 'react';
import Calendar from 'antd/lib/calendar';
import type { Moment } from 'moment';
import moment from 'moment';

const WeeklyCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Moment>(moment());

    const dateCellRender = (date: Moment) => {
        if (date.week() === selectedDate.week() && date.year() === selectedDate.year()) {
            return <div style={{ background: '#f0f0f0' }}>{date.date()}</div>;
        }
        return null;
    };

    const onSelect = (date: Moment) => {
        setSelectedDate(date);
    };

    return (
        <Calendar
            value={selectedDate}
            fullscreen={false}
            dateCellRender={dateCellRender}
            onSelect={onSelect}
            headerRender={({ value, onChange }) => {
                const startOfWeek = value.startOf('week');
                const endOfWeek = value.endOf('week');

                return (
                    <div>
                        <button onClick={() => onChange(value.clone().subtract(1, 'week'))}>
                            Previous
                        </button>
                        <span>
              {startOfWeek.format('YYYY-MM-DD')} ~ {endOfWeek.format('YYYY-MM-DD')}
            </span>
                        <button onClick={() => onChange(value.clone().add(1, 'week'))}>
                            Next
                        </button>
                    </div>
                );
            }}
        />
    );
};

export default WeeklyCalendar;