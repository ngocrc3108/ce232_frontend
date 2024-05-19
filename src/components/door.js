import { onOffHandler } from "./device"
import Switch from "./switch";

export default function Door() {
    return (
        <div>
            <Switch onChange={onOffHandler}></Switch>
        </div>
    );
}