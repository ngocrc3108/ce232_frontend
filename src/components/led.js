import { onOffHandler } from "./device"
import Switch from "./switch";

export default function Led() {
    return (
        <div>
            <Switch onChange={onOffHandler}></Switch>
        </div>
    );
}