import React, { useState } from 'react';

const MyCustomDatePicker = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    const handleYearChange = (event) => {
        setSelectedYear(Number(event.target.value));
        setSelectedDate(null);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(Number(event.target.value));
        setSelectedDate(null);
    };

    const handleDateChange = (event) => {
        const day = Number(event.target.value);
        setSelectedDate(new Date(selectedYear, selectedMonth, day));
    };

    const generateDaysInMonth = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const days = generateDaysInMonth(selectedMonth, selectedYear);

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>날짜 선택기</h3>
            <div style={styles.selectContainer}>
                <select value={selectedMonth} onChange={handleMonthChange} style={styles.select}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                            {i + 1}월
                        </option>
                    ))}
                </select>

                <select value={selectedYear} onChange={handleYearChange} style={styles.select}>
                    {Array.from({ length: 50 }, (_, i) => (
                        <option key={i} value={currentYear - 25 + i}>
                            {currentYear - 25 + i}년
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.selectContainer}>
                <select value={selectedDate ? selectedDate.getDate() : ''} onChange={handleDateChange} style={styles.select}>
                    <option value="" disabled>일 선택</option>
                    {days.map((day) => (
                        <option key={day} value={day}>
                            {day}일
                        </option>
                    ))}
                </select>
            </div>

            {selectedDate && (
                <p style={styles.selectedDate}>
                    선택된 날짜: {selectedDate.toLocaleDateString()}
                </p>
            )}
        </div>
    );
};

// 스타일 오브젝트
const styles = {
    container: {
        padding: '20px',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
    },
    title: {
        marginBottom: '15px',
        fontSize: '20px',
        color: '#333',
    },
    selectContainer: {
        marginBottom: '10px',
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #d9d9d9',
        fontSize: '16px',
        cursor: 'pointer',
        outline: 'none',
    },
    selectedDate: {
        marginTop: '10px',
        fontSize: '16px',
        color: '#555',
    },
};

export default MyCustomDatePicker;