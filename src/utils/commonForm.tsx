import Card from "antd/lib/card/Card";
import React from "react";
import Input from "antd/lib/input/Input";
import moment from "moment";
import DatePicker from "antd/lib/date-picker";
import TextArea from "antd/lib/input/TextArea";

export function BoxCard({children, title=''}) {

    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                 }}>
        {children}
    </Card>
}

export const InputForm = ({ title, id, value, onChange, disabled = false, suffix = null, placeholder = '', onKeyDown }) => {
    return (
        <div>
            <div>{title}</div>
            <Input
                id={id}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={onChange}
                size="small"
                onKeyDown={onKeyDown}
                suffix={suffix}
            />
        </div>
    );
};

export const TextAreaForm = ({ title, id, value, onChange, rows = 5, disabled = false }) => {
    return (
        <div>
            <div>{title}</div>
            <TextArea
                style={{ resize: "none" }}
                rows={rows}
                id={id}
                value={value}
                disabled={disabled}
                onChange={onChange}
                size="small"
                showCount
                maxLength={1000}
            />
        </div>
    );
};

export const DatePickerForm = ({ title, id, value, onChange, disabledDate, disabled = false }) => {
    return (
        <div>
            <div>{title}</div>
            {/* @ts-ignore */}
            <DatePicker
                value={value ? moment(value) : ''}
                style={{ width: "100%" }}
                disabledDate={disabledDate}
                onChange={(date) =>
                    onChange({
                        target: {
                            id: id,
                            value: date,
                        },
                    })
                }
                disabled={disabled}
                id={id}
                size="small"
            />
        </div>
    );
};