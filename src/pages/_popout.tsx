import { useEffect, useState } from "react";
import { Layout, Model } from "flexlayout-react";
import "flexlayout-react/style/light.css";

export default function PopoutPage() {
    const [model, setModel] = useState(null);

    useEffect(() => {
        // 🚀 새 창에서 `localStorage`로부터 Model 상태를 가져옴
        const storedModel = localStorage.getItem("popoutModel");
        if (storedModel) {
            setModel(Model.fromJson(JSON.parse(storedModel)));
        }
    }, []);

    return (
        <div>
            {model ? (
                <Layout
                    model={model}
                    factory={() => <div>팝아웃된 탭</div>}
                />
            ) : (
                <div>로딩 중...</div>
            )}
        </div>
    );
}