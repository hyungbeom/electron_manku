import {useRef} from "react";

export default function Header(){

    const headerRef = useRef(null);

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;

        const handleMouseMove = (moveEvent) => {
            const x = moveEvent.clientX - clientX;
            const y = moveEvent.clientY - clientY;

        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    return <div  ref={headerRef}
                 onMouseDown={handleMouseDown} style={{width : '100%', height : 40, backgroundColor : 'blue'}}></div>
}