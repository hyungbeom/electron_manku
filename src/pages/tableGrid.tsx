import React from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming';


const TableGrid = () => {

    const myTheme = themeQuartz
        .withPart(iconSetMaterial)
        .withParams({
            browserColorScheme: "light",
            cellHorizontalPaddingScale: 0.5,
            columnBorder: true,
            // fontFamily: [
            //     Arial,
            //     sans-serif
            // ],
            fontSize: "11px",
            headerBackgroundColor: "#FFFFFF",
            headerFontSize: "13px",
            headerFontWeight: 500,
            headerVerticalPaddingScale: 0.8,
            iconSize: "11px",
            rowBorder: true,
            rowVerticalPaddingScale: 0.8,
            sidePanelBorder: true,
            spacing: "5px",
            wrapperBorder: true,
            wrapperBorderRadius: "6px"
        });


    return (
        <div>
            
        </div>
    );
};

export default TableGrid;