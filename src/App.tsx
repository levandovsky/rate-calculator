import "./App.css";
import Select from "./components/Select";
import { useMergeState } from "./hooks/useMergeState";
import { CURRENCIES, Currency } from "./currencies";
import Field from "./components/Field";
import { ConverterParams, useConverter } from "./hooks/useConverter";
import Input from "./components/Input";
import { useState } from "react";
import { classnames } from "./utils/classnames";
import SvgReverseIcon from "./assets/reverse.svg";

type State = Partial<ConverterParams> & { amount: number };

const currencyList = Object.keys(CURRENCIES) as Currency[];

const canCalculate = (state: State): state is ConverterParams => {
  return !!state.from && !!state.to && state.amount > 0;
};

const optionFormat = (option: Currency) => `${CURRENCIES[option]} ${option}`;

function App() {
  const [calculated, setCalculated] = useState(false);
  const [state, setState] = useMergeState<State>({
    from: undefined,
    to: undefined,
    amount: 0,
  });

  const { converterData, calculateRates, isLoading, error } = useConverter();

  const currenciesFrom = currencyList.filter(
    (currency) => currency !== state.to
  );

  const currenciesTo = currencyList.filter(
    (currency) => currency !== state.from
  );

  const updateConverterData = async (update: Partial<State>) => {
    const newState: State = { ...state, ...update };
    setState(newState);

    if (canCalculate(newState) && calculated) {
      await calculateRates(newState);
    }
  };

  return (
    <main className="app">
      <form
        className="calculator"
        onSubmit={(e) => {
          e.preventDefault();

          setCalculated(true);

          if (canCalculate(state)) {
            calculateRates(state);
          }
        }}
      >
        <div className="currencies">
          <Field name="from" label="FROM">
            <Select
              name="from"
              value={state.from}
              options={currenciesFrom}
              onChange={(value) => {
                updateConverterData({
                  from: value,
                });
              }}
              formatOption={optionFormat}
            />
          </Field>
          <button
            type="button"
            className="reverse-button"
            disabled={!state.to || !state.from}
            onClick={() => {
              updateConverterData({
                from: state.to,
                to: state.from,
              });
            }}
          >
            <SvgReverseIcon />
          </button>
          <Field name="to" label="TO">
            <Select
              name="to"
              value={state.to}
              options={currenciesTo}
              onChange={(value) => {
                updateConverterData({
                  to: value,
                });
              }}
              formatOption={optionFormat}
            />
          </Field>
        </div>
        <div className="amount-container">
          <Field name="amount" label="AMOUNT">
            <Input
              name="amount"
              value={state.amount}
              onChange={(value) => {
                updateConverterData({
                  amount: value,
                });
              }}
            />
          </Field>
          {converterData && (
            <Field name="converted" label="CONVERTED TO">
              <Input name="converted" value={converterData.toAmount} readOnly />
            </Field>
          )}
        </div>
        {converterData && (
          <div className="rate">
            <div>
              1 {state.from} = {converterData.rate} {state.to}
            </div>
            <div>
              All figures are live mid-market rates, which are for informational
              purposes only. To see the rates we quote for money transfer,
              please select Live Money Transfer Rates.
            </div>
          </div>
        )}
        {!calculated && (
          <button
            disabled={!canCalculate(state)}
            className={classnames("button", {
              "button-loading": isLoading,
            })}
            type="submit"
          >
            Convert
          </button>
        )}
      </form>
    </main>
  );
}

export default App;
