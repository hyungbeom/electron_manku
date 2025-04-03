import React, {useContext, useEffect, useRef, useState} from "react";


import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import InputNumber from "antd/lib/input-number";

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
export const EditableCell = ({
                                 title,
                                 editable,
                                 children,
                                 dataIndex,
                                 record,
                                 handleSave,
                                 ...restProps
                             }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {

        }
    };

    let childNode;

    if (editable) {
        // 값이 없을 경우 Input을 기본으로 보여주고, 값이 있을 경우 기존 로직을 적용
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                // rules={[
                //     {
                //         required: true,
                //         message: `${title} is required.`,
                //     },
                // ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingInlineEnd: 24,
                }}
                onClick={toggleEdit}
            >
                {record[dataIndex] || (
                    <Input
                        placeholder={title}
                        ref={inputRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleEdit();
                        }}
                        style={{ cursor: 'text', width: '100%' }}
                    />
                )}
            </div>
        );
    } else {
        childNode = children;
    }

    return <td {...restProps}>{childNode}</td>;
};