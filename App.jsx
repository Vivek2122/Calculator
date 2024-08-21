import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./style.css"
import { act } from "react"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation', 
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      return {
        ...state,
        overwrite: false,
        currentOperand: payload.digit
      }
      if(state.currentOperand == '0' && payload.digit == '0')return state
      if(state.currentOperand && state.currentOperand.includes('.') && payload.digit == '.')return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case ACTIONS.CHOOSE_OPERATION:
      if(!state.currentOperand && !state.previousOperand)return state
      if(state.previousOperand && state.operation && !state.currentOperand)return {
        ...state,
        operation: payload.operation
      }
      if(state.previousOperand && state.operation)
      return {
        ...state,
        operation: payload.operation,
        currentOperand: null,
        previousOperand: evaluate(state)
      }
      return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation
        }
        case ACTIONS.CLEAR:
          return{
            ...state,
            currentOperand: null,
            previousOperand: null,
            operation: null
          }
          case ACTIONS.EVALUATE:
          if(!state.previousOperand || !state.currentOperand || !state.operation)return state  
          return {
              ...state,
              overwrite: true,
              currentOperand: evaluate(state),
              previousOperand: null,
              operation: null
            }
            case ACTIONS.DELETE_DIGIT:
              if(state.overwrite)
                return {
                  ...state,
                  overwrite: false,
                  currentOperand: null
              }
              if(!state.currentOperand)return state
              if(state.currentOperand.length == 1)
                return {
                  ...state,
                  currentOperand: null
              }
              return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
              }
  }  
}

function evaluate({currentOperand, previousOperand, operation})
{
  let prev = parseFloat(previousOperand)
  let cur = parseFloat(currentOperand)
  if(isNaN(prev) && isNaN(cur))return ""
  let computation = ""
  switch(operation)
  {
    case '+':
      computation = prev + cur
      break
      case '-':
        computation = prev - cur
        break
        case '*':
          computation = prev * cur
          break
          case '/':
            computation = prev / cur
            break
  }
  return computation.toString()
}

function App() {
  
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='/' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App
