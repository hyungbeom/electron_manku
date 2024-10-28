import React from 'react';
import * as contextmenu from 'react-contextmenu';

const MyComponent = ({children}:any) => {
    const handleClick = (e, data) => {
        alert(`클릭한 메뉴: ${data.item}`);
    };

    return (
        <div>
            {/*@ts-ignored*/}
            <contextmenu.ContextMenuTrigger id="context-menu">
                {children}
            </contextmenu.ContextMenuTrigger>

            {/*@ts-ignored*/}
            <contextmenu.ContextMenu id="context-menu">
                {/*@ts-ignored*/}
                <contextmenu.MenuItem data={{item: '옵션 1'}} onClick={handleClick}>
                    옵션 1
                </contextmenu.MenuItem>
                {/*@ts-ignored*/}
                <contextmenu.MenuItem data={{item: '옵션 2'}} onClick={handleClick}>
                    옵션 2
                </contextmenu.MenuItem>
                {/*@ts-ignored*/}
                <contextmenu.MenuItem divider/>
                {/*@ts-ignored*/}
                <contextmenu.MenuItem data={{item: '옵션 3'}} onClick={handleClick}>
                    옵션 3
                </contextmenu.MenuItem>
            </contextmenu.ContextMenu>
        </div>
    );
};

export default MyComponent;