import React, { useState } from 'react';

const DragResizeTable = () => {
    const initialColumns = [
        { title: 'Name', width: 150 },
        { title: 'Age', width: 100 },
        { title: 'Address', width: 200 },
    ];

    const [columns, setColumns] = useState(initialColumns);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

    const handleDragEnd = (index) => {
        if (draggingIndex !== null) {
            const newColumns = [...columns];
            const draggedColumn = newColumns.splice(draggingIndex, 1)[0];
            newColumns.splice(index, 0, draggedColumn);
            setColumns(newColumns);
            setDraggingIndex(null);
            setHoverIndex(null);
        }
    };

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (e) => {
            const newWidth = Math.max(50, columns[index].width + (e.clientX - startX));
            setColumns((prev) => {
                const newColumns = [...prev];
                newColumns[index].width = newWidth < 50 ? 50 : newWidth; // 최소 너비 보장
                return newColumns;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleDragOver = (index) => {
        setHoverIndex(index);
    };

    const handleDragLeave = () => {
        setHoverIndex(null);
    };

    return (
        <table>
            <thead>
            <tr>
                {columns.map((col, index) => (
                    <th
                        key={index}
                        style={{
                            width: col.width,
                            backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
                        }}
                        onMouseDown={() => handleDragStart(index)}
                        onMouseUp={() => handleDragEnd(index)}
                        onMouseEnter={() => handleDragOver(index)}
                        onMouseLeave={handleDragLeave}
                    >
                        {col.title}
                        <div
                            className="resizer"
                            onMouseDown={(e) => handleMouseDown(index, e)}
                        />
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {/* 데이터 행 추가 */}
            </tbody>
        </table>
    );
};

export default DragResizeTable;