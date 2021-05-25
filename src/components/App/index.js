import { useCallback, useEffect, useState } from 'react';
import Spreadsheet from '../Spreadsheet';
import { DropdownButton, Dropdown, Button, Badge} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import XLSX from 'xlsx';

import SelectItem from '../SelectItem';

import './index.scss';
import {setList, setX, setY} from '../../actions/creator';
import { lettersToNumber, numberToLetters, mnk } from '../../util';

function App(){
    const [input, setInput] = useState(-1);
    const [select, setSelect] = useState([]);
    const [result, setResult] = useState(null);

    const workbook = useSelector(state => state.workbook);
    const list = useSelector(state => state.list);
    const x = useSelector(state => state.x);
    const y = useSelector(state => state.y);

    const dispatch = useDispatch();

    const selectList = index => {
        dispatch(setList(workbook.SheetNames[index]));
    };

    useEffect(() => {
        setResult(null);
    }, [workbook, x, y, list])

    useEffect(() => {
        if(input == 0){
            dispatch(setX({...select}));
        }else if(input == 1){
            dispatch(setY({...select}));
        }
    }, [select]);

    useEffect(() => {
        dispatch(setX({}));
        dispatch(setY({}));
    }, [list]);

    let getData = useCallback(() => {
        let xWrong = false;
        let yWrong = false;


        let xData = [];
        let yData = [];

        let xLength = 0;
        let yLength = 0;

        let errors = [];
        

        if(x.start != undefined){
            if(x.start.j == x.end.j){
                xLength = x.end.i - x.start.i 
            }else if(x.start.i == x.end.i){
                xLength = x.end.j - x.start.j;
            }
        }

        if(y.start != undefined){
            if(y.start.j == y.end.j){
                yLength = y.end.i - y.start.i 
            }else if(y.start.i == y.end.i){
                yLength = y.end.j - y.start.j;
            }
        }

        xLength = Math.abs(xLength);
        yLength = Math.abs(yLength);

        if(x.start != undefined){
            try{
                if(x.start.j == x.end.j){
                    if(x.start.i <= x.end.i){
                        for(var i = x.start.i; i <= x.end.i; i++){
                            xData.push(workbook.Sheets[list][numberToLetters(x.start.j - 1)+i].v);
                        }
                    }else{
                        for(var i = x.start.i; i >= x.end.i; i--){
                            xData.push(workbook.Sheets[list][numberToLetters(x.start.j - 1)+i].v);
                        }
                    }

                }else if(x.start.i == x.end.i){
                    if(x.start.j <= x.end.j){
                        for(var i = x.start.j; i <= x.end.j; i++){
                            xData.push(workbook.Sheets[list][numberToLetters(i - 1) + (x.start.i)].v);
                        }
                    }else{
                        for(var i = x.start.j; i >= x.end.j; i--){
                            xData.push(workbook.Sheets[list][numberToLetters(i - 1) + (x.start.i)].v);
                        }
                    }
                }
            }catch(e){
                xData = [];
                xWrong = true;
                errors.push("Промежуток X содержит не только числа");
            }
        }

        if(y.start != undefined){
            try{
                if(y.start.j == y.end.j){
                    if(y.start.i <= y.end.i){
                        for(var i = y.start.i; i <= y.end.i; i++){
                            yData.push(workbook.Sheets[list][numberToLetters(y.start.j - 1)+i].v);
                        }
                    }else{
                        for(var i = y.start.i; i >= y.end.i; i--){
                            yData.push(workbook.Sheets[list][numberToLetters(y.start.j - 1)+i].v);
                        }
                    }
                
                }else if(y.start.i == y.end.i){
                    if(y.start.j <= y.end.j){
                        for(var i = y.start.j; i <= y.end.j; i++){
                            yData.push(workbook.Sheets[list][numberToLetters(i) + (y.start.j - 1)].v);
                        }
                    }else{
                        for(var i = y.start.j; i > y.end.j; i--){
                            yData.push(workbook.Sheets[list][numberToLetters(i) + (y.start.j - 1)].v);
                        }
                    }
                }
            }catch(e){
                yData = [];
                yWrong = true;
                errors.push("Промежуток Y содержит не только числа");
            }
        }

        if(x.start != undefined ? x.start.i != x.end.i && x.start.j != x.end.j : false){
            xWrong = true;
            errors.push("Промежуток X некорректен");
        }
    
        if(y.start != undefined ? y.start.i != y.end.i && y.start.j != y.end.j : false){
            yWrong = true;
            errors.push("Промежуток Y некорректен");
        }
    
        if(xLength != yLength){
            errors.push("Длины промежутков не совпадают");
        }

        return {
            x: xData,
            y: yData,
            xWrong,
            yWrong,
            errors
        }
    }, [x, y, workbook]);

    let submit = () => {
        setInput(-1);
        setResult(mnk(dataResult.x, dataResult.y));
    };

    let dataResult = getData();
    let ready = dataResult.errors.length == 0;

    return (
        <div className="App">
            <div className="app-wrapper">
                <div className="sheet-wrapper">
                    <div className="sheet">
                        <Spreadsheet onSelect={setSelect} disabled={input == -1} input={input}/>
                    </div>
                </div>
                <div className="data-wrapper">
                    <div className="data">
                        
                        <div className="inner-section">
                            <div className="inner-section-title">Лист</div>
                            <DropdownButton className="inner-section__list-selector" title={list == '' ? 'Выберите лист' : list} disabled={workbook == null} >
                                {workbook != null &&
                                    workbook.SheetNames.map((item, index) => <Dropdown.Item onClick={() => selectList(index)} key={index} eventKey={index}>{item}</Dropdown.Item>)
                                }
                            </DropdownButton>
                            {/* <div className="inner-section-title">Ошибки</div>
                            <div className="data-select-info">
                                {dataResult.errors.map(info => <span>{info}</span>)}
                                {dataResult.errors.length == 0 && <span>Oшибок нет</span>}
                            </div> */}
                            <div className="inner-section-title">Данные {!ready && <Badge variant="danger">Содержат ошибки</Badge>}</div>
                            <div className="data-select">
                                <SelectItem name={"X"} data={x} disabled={workbook == null} selected={input == 0} onSelect={() => setInput(0)} onDisSelect={() => setInput(-1)} wrong={dataResult.xWrong} />
                                <SelectItem name={"Y"} data={y} disabled={workbook == null} selected={input == 1} onSelect={() => setInput(1)} onDisSelect={() => setInput(-1)} wrong={dataResult.yWrong} />
                                <Button onClick={submit} variant="primary" block disabled={!ready || workbook == null}>Рассчитать</Button>
                            </div>
                        </div>

                    </div>
                    {result != null && 
                        <div className="result">
                            <div className="inner-section">
                                <div className="inner-section-title">Значения</div>
                                <div className="result">
                                    <div className="result-item">
                                        <span className="result-item__value">b<span className="result-item__index">a</span></span>=<span className="result-item__result">{result.b.toFixed(4)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-item__value">a<span className="result-item__index">a</span></span>=<span className="result-item__result">{result.a.toFixed(4)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-item__value">Δ<span className="result-item__index">b</span></span>=<span className="result-item__result">{result.d_b.toFixed(4)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-item__value">Δ<span className="result-item__index">a</span></span>=<span className="result-item__result">{result.d_a.toFixed(4)}</span>
                                    </div>
                                    
                                    <div
                                        onClick={() => {
                                            XLSX.writeFile(result.wb, 'out.xlsb');
                                        }}
                                        className="result-download-button"
                                    >Скачать Таблицы</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
