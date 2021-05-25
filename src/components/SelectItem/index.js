import {Button} from 'react-bootstrap';
import { numberToLetters } from "../../util";

function SelectItem({selected, onSelect, onDisSelect, data, wrong, name, disabled}){
    return(
        <>
            <div className="data-select-title">{name} данные</div>
            <div className={"data-select-item " + (wrong ? "wrong" : "")}>
                <div className="data-select-item__point">
                    <div className="data-select-item__point-name">Начало</div>
                    {data.start === undefined ? '??' : numberToLetters(data.start.j - 1) + data.start.i}
                </div>
                <div className="data-select-item__delimiter"></div>
                <div className="data-select-item__point">
                    <div className="data-select-item__point-name">Конец</div>
                    {data.end === undefined ? '??' : numberToLetters(data.end.j - 1) + data.end.i}
                </div>
                {!selected ?
                    <Button className="data-select-item__select" onClick={onSelect} disabled={disabled}>
                        Выбрать
                    </Button>
                    :
                    <Button variant="secondary" className="data-select-item__select" onClick={onDisSelect} disabled={disabled}>
                        Завершить
                    </Button>
                }
            </div>
        </>
    );
}

export default SelectItem;