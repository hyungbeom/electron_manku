import React from 'react';
import * as contextmenu from 'react-contextmenu';

const MyComponent = ({children}) => {
    const handleClick = (e, data) => {
        alert(`클릭한 메뉴: ${data.item}`);
    };

    return (
        <div>
            <contextmenu.ContextMenuTrigger id="context-menu">
                {children}
            </contextmenu.ContextMenuTrigger>

            <contextmenu.ContextMenu id="context-menu">
                <contextmenu.MenuItem data={{item: '옵션 1'}} onClick={handleClick}>
                    옵션 1
                </contextmenu.MenuItem>
                <contextmenu.MenuItem data={{item: '옵션 2'}} onClick={handleClick}>
                    옵션 2
                </contextmenu.MenuItem>
                <contextmenu.MenuItem divider/>
                <contextmenu.MenuItem data={{item: '옵션 3'}} onClick={handleClick}>
                    옵션 3
                </contextmenu.MenuItem>
            </contextmenu.ContextMenu>
        </div>
    );
};

export default MyComponent;