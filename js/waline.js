import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";
window.onload = function waline() {
    init({
        el: "#waline",
        serverURL: "http://localhost:3000",
        locale: {
            level0: "石器时代",
            level1: "来硬的",
            level2: "金光闪闪",
            level3: "钻石！",
            level4: "深藏不露"
        }
    });
}